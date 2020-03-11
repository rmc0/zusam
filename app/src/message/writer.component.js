import { h, render, Component } from "preact";
import { lang, alert, cache, http, me, router, util } from "/core";
import { FaIcon } from "/misc";
import EmbedBlock from "./embed-block.component.js";
import FileGrid from "./file-grid.component.js";

export default class Writer extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
    this.genPreview = this.genPreview.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.putMessage = this.putMessage.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.toggleFile = this.toggleFile.bind(this);
    this.inputImages = this.inputImages.bind(this);
    this.inputVideo = this.inputVideo.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.uploadNextImage = this.uploadNextImage.bind(this);
    this.state = { files: [], writerId: +Date.now() };
  }

  componentWillMount() {
    this.setState({
      files: this.props.files || [],
      link: null,
      preview: null
    });
  }

  componentDidMount() {
    if (document.getElementById("title")) {
      document.getElementById("title").value = this.props.title || "";
    }
    if (document.getElementById("text")) {
      document.getElementById("text").value = this.props.text || "";
    }
  }

  onKeyPress(event, doGenPreview = false) {
    if (event.ctrlKey && event.key == "Enter") {
      this.sendMessage();
      return;
    }
    if (![" ", "Enter", "v"].includes(event.key)) {
      return;
    }
    if (doGenPreview) {
      this.genPreview(event.currentTarget);
    }
  }

  genPreview(t) {
    t.style.height = "1px";
    t.style.height = 25 + t.scrollHeight + "px";
    // waiting for the dom to be updated
    setTimeout(() => {
      const text = t.value;
      let links = text.match(/(https?:\/\/[^\s]+)/gi);
      if (links && links[0] != this.state.link) {
        cache
          .get("/api/links/by_url?url=" + encodeURIComponent(links[0]))
          .then(r => {
            if (r && t.value.indexOf(links[0]) >= 0) {
              this.setState({ link: links[0], preview: r });
            }
          });
      }
    }, 0);
  }

  // toggle state (removed or not) of a file
  toggleFile(fileIndex) {
    let files = this.state.files;
    let f = files.find(f => f.fileIndex == fileIndex);
    f.removed = f.removed ? false : true;
    this.setState({ files: files });
  }

  sendMessage() {
    if (this.props.messageId) {
      this.putMessage();
    } else {
      this.postMessage();
    }
  }

  putMessage() {
    let msg = {
      files: this.state.files
        .filter(e => !e.removed)
        .map(e => e["id"])
        .filter(e => !!e),
      data: {
        text: document.getElementById("text").value
      }
    };
    if (document.getElementById("title")) {
      msg.data.title = document.getElementById("title").value || "";
    }
    http.put("/api/messages/" + this.props.messageId, msg).then(res => {
      this.setState({ sending: false });
      if (!res) {
        alert.add(lang.t("error_new_message"), "alert-danger");
        return;
      }
      window.dispatchEvent(new CustomEvent("editMessage", { detail: res }));
    });
    this.setState({ sending: true });
  }

  postMessage() {
    let msg = {
      createdAt: Math.floor(Date.now() / 1000),
      author: me.me["id"],
      group: util.getId(this.props.group),
      children: [],
      files: this.state.files
        .filter(e => !e.removed)
        .map(e => e["id"])
        .filter(e => !!e),
      data: {
        text: (document.getElementById("text").value || "").substring(0, 50000)
      },
      lastActivityDate: Math.floor(Date.now() / 1000)
    };
    if (this.props.parent) {
      msg.parent = util.getId(this.props.parent);
    }
    if (document.getElementById("title")) {
      msg.data.title = document.getElementById("title").value || "";
    }
    // don't post if there is nothing to post
    if (!msg.files.length && !msg.data.text && !msg.data.title) {
      alert.add(lang.t("empty_message"), "alert-danger");
      return;
    }
    http.post("/api/messages", msg).then(res => {
      if (!res) {
        this.setState({ sending: false });
        alert.add(lang.t("error_new_message"), "alert-danger");
        return;
      }
      if (this.props.isChild) {
        this.setState({ sending: false });
        cache.remove("/api/messages/" + this.props.parent);
        window.dispatchEvent(new CustomEvent("newChild", { detail: res }));
      } else {
        cache.remove(this.props.group);
        setTimeout(_ => {
          router.navigate(router.backUrl || msg.group.slice(4));
        }, 500);
      }
      this.setState({
        files: [],
        link: null,
        preview: null,
        writerId: +Date.now()
      });
      if (document.getElementById("text")) {
        document.getElementById("text").value = "";
      }
    });
    this.setState({ sending: true });
  }

  inputImages(event) {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style.display = "none";
    input.type = "file";
    input.multiple = "multiple";
    input.accept = "image/*";
    input.addEventListener("change", event => {
      let list = Array.from(event.target.files);
      let files = this.state.files;
      this.setState({
        files: [
          ...files,
          ...Array.apply(null, Array(list.length)).map(
            _ =>
              new Object({
                fileIndex: 1000
              })
          )
        ]
      });
      this.uploadNextImage(list, list[Symbol.iterator](), files.length);
    });
    input.click();
  }

  inputVideo(event) {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style.display = "none";
    input.type = "file";
    input.accept = "video/*";
    input.addEventListener("change", event => {
      let files = this.state.files;
      let placeholderIndex = Date.now();
      this.setState({
        files: [
          ...files,
          {
            fileIndex: placeholderIndex,
            type: "video",
            progress: 0
          }
        ]
      });
      this.uploadFile(event.target.files[0], files.length, placeholderIndex);
    });
    input.click();
  }

  uploadNextImage(list, it, n) {
    let e = null;
    try {
      if (!it) {
        return;
      }
      e = it.next();
      if (!e || !e.value) {
        return;
      }
      let fileSize = e.value.size;
    } catch (evt) {
      // this is a fix for firefox mobile
      // firefox mobile only gets one file on "input multiple" and throws on getting the size
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1456557
      alert.add(lang.t("multiple_photos_upload"), "alert-danger");
      return;
    }
    import("/lazy/image-service.js").then(imageService => {
      imageService.default.handleImage(e.value, res =>
        this.uploadFile(res, n + list.indexOf(e.value), null, () =>
          this.uploadNextImage(list, it, n)
        )
      );
    });
  }

  uploadFile(file, fileIndex, placeholderIndex, callback = null) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileIndex", fileIndex);
    let progressFn = placeholderIndex
      ? e => {
          if (Array.isArray(this.state.files)) {
            let a = this.state.files;
            file = a.find(f => f.fileIndex == placeholderIndex);
            if (file) {
              file.progress = Math.floor((e.loaded / e.total) * 100);
              a.splice(fileIndex, 1, file);
              this.setState({ files: a });
            }
          }
        }
      : null;
    // update state only if it's the good writeId
    let writerId = this.state.writerId;
    http.sendFile(
      formData,
      file => {
        if (writerId != this.state.writerId) {
          return;
        }
        let a = this.state.files;
        if (!file) {
          alert.add(lang.t("error_upload"), "alert-danger");
        } else {
          a.splice(fileIndex, 1, file);
        }
        this.setState({ files: a });
        if (callback) {
          callback();
        }
      },
      progressFn,
      e => {
        console.warn(e);
        alert.add(lang.t("error_upload"), "alert-danger");
        let a = this.state.files;
        a.splice(fileIndex, 1, { fileIndex: fileIndex, error: e });
        this.setState({ files: a });
      }
    );
  }

  render() {
    if (this.state.sending) {
      return (
        <div class="message-placeholder">
          <div class="spinner orange-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      );
    }
    return (
      <div class="writer">
        {!this.props.isChild && (
          <input
            type="text"
            id="title"
            onKeyPress={e => this.onKeyPress(e)}
            placeholder={lang.t("title_placeholder")}
          ></input>
        )}
        <textarea
          onKeyPress={e => this.onKeyPress(e, true)}
          id="text"
          rows="5"
          autocomplete="off"
          autofocus={this.props.focus}
          placeholder={lang.t("text_placeholder")}
          maxlength="50000"
        ></textarea>
        {this.state.preview && (
          <EmbedBlock inWriter={true} {...this.state.preview} />
        )}
        {!!this.state.files.length && (
          <FileGrid
            key={this.state.files.reduce(
              (a, c) => a + c.id + c.fileIndex + c.error,
              ""
            )}
            files={this.state.files}
            toggleFile={this.toggleFile}
            inWriter={true}
          />
        )}
        <div class="options">
          <button
            class="option"
            onClick={e => this.inputImages(e)}
            title={lang.t("upload_image")}
          >
            <FaIcon family={"regular"} icon={"images"} />
          </button>
          <button
            class="option"
            onClick={e => this.inputVideo(e)}
            title={lang.t("upload_video")}
          >
            <FaIcon family={"solid"} icon={"film"} />
          </button>
          <div class="actions">
            {this.props.cancel && (
              <button class="cancel" onClick={e => this.props.cancel(e)}>
                {lang.t("cancel")}
              </button>
            )}
            <button
              disabled={!this.props.group}
              type="submit"
              class="submit"
              onClick={e => this.sendMessage(e)}
            >
              {lang.t("submit")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
