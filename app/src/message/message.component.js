import { Fragment, h, render, Component } from "preact";
import { lang, storage, http, me, router, util } from "/core";
import { FaIcon } from "/misc";
import MessageChildren from "./message-children.component.js";
import MessageHead from "./message-head.component.js";
import MessageFooter from "./message-footer.component.js";
import MessageBody from "./message-body.component.js";
import Writer from "./writer.component.js";

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.getComponentClass = this.getComponentClass.bind(this);
    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.shareMessage = this.shareMessage.bind(this);
    this.publishInGroup = this.publishInGroup.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.onEditMessage = this.onEditMessage.bind(this);
    window.addEventListener("editMessage", this.onEditMessage);
  }

  onEditMessage(event) {
    if (event.detail.id == this.props.message.id) {
      this.props.key = +Date.now();
      let msg = this.props.message;
      msg.data = event.detail.data;
      msg.files = event.detail.files;
      this.setState({
        message: msg,
        data: msg.data,
        gotPreview: false
      });
      setTimeout(_ => this.setState({ edit: false }));
    }
  }

  getComponentClass() {
    let cn = "message";
    if (this.props.isChild) {
      cn += " child";
    }
    if (this.props.message.id == router.action) {
      cn += " highlight";
    }
    return cn;
  }

  deleteMessage(event) {
    event.preventDefault();
    if (confirm(lang.t("ask_delete_message"))) {
      http.delete("/api/messages/" + this.props.message["id"]);
      // give some time to the storage to delete itself properly
      setTimeout(() => {
        router.navigate("/groups/" + this.props.message.group.id, {
          data: { resetGroupDisplay: true }
        });
      }, 100);
    }
  }

  shareMessage(event) {
    event.preventDefault();
    router.navigate("/share?message=" + this.props.message.id);
  }

  editMessage(event) {
    event.preventDefault();
    this.setState({ edit: true });
  }

  publishInGroup() {
    http
      .put("/api/messages/" + this.props.message.id, {
        lastActivityDate: Math.floor(Date.now() / 1000),
        isInFront: true
      })
      .then(res => {
        if (!res) {
          alert.add(lang.t("error"), "alert-danger");
          return;
        }
        router.navigate("/groups/" + this.props.message.group.id);
      });
  }

  cancelEdit(event) {
    event.preventDefault();
    this.setState({ edit: false });
  }

  displayWriter(isChild, focus) {
    return (
      <Writer
        cancel={this.state.edit ? this.cancelEdit : null}
        files={this.state.edit ? this.props.message.files : []}
        focus={focus || !!this.state.edit}
        group={this.props.message.group}
        messageId={this.state.edit ? this.props.message.id : null}
        parent={
          this.state.edit ? this.props.message["parent"] : this.props.message.id
        }
        text={this.state.edit ? this.props.message.data["text"] : ""}
        title={this.state.edit ? this.props.message.data["title"] : ""}
        isChild={isChild}
      />
    );
  }

  render() {
    return (
      <Fragment>
        <div
          id={this.props.message.id}
          className={this.getComponentClass()}
        >
          {this.state.edit && this.displayWriter(this.props.isChild)}
          {!this.state.edit && (
            <Fragment>
              {this.props.preMessageHeadComponent}
              <MessageHead
                author={this.props.message["author"]}
                message={this.props.message}
                isPublic={this.props.isPublic}
                isChild={this.props.isChild}
              />
              <div class="main">
                <MessageBody
                  message={this.props.message}
                  isPublic={this.props.isPublic}
                  isChild={this.props.isChild}
                />
                <MessageFooter
                  author={this.props.message["author"]}
                  message={this.props.message}
                  editMessage={this.editMessage}
                  deleteMessage={this.deleteMessage}
                  shareMessage={this.shareMessage}
                  publishInGroup={this.publishInGroup}
                  isPublic={this.props.isPublic}
                  isChild={this.props.isChild}
                />
              </div>
            </Fragment>
          )}
        </div>
        {this.props.postMessageComponent}
        {!this.props.isChild && (
          <MessageChildren
            childMessages={this.props.message.children}
            isPublic={this.props.isPublic}
            key={this.props.message.id}
          />
        )}
        {!this.state.edit && !this.props.isPublic && !this.props.isChild && (
          <div class="message child mt-2">
            {me.me && (
              <div class="message-head d-none d-md-block">
                <img
                  class="rounded-circle w-3 material-shadow avatar"
                  style={util.backgroundHash(me.me.id)}
                  src={
                    me.me.avatar
                      ? util.crop(me.me.avatar["id"], 100, 100)
                      : util.defaultAvatar
                  }
                />
              </div>
            )}
            {this.displayWriter(true, this.props.focus)}
          </div>
        )}
        </Fragment>
    );
  }
}
