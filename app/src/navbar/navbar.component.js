import { h, render, Component } from "preact";
import { lang, me, router, util } from "/core";
import { FaIcon } from "/misc";
import { Search } from "/pages";
import { GroupsDropdownNavbar, NotificationsDropdownNavbar } from "/navbar";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.clickBackButton = this.clickBackButton.bind(this);
    // force update the navbar when me gets updated
    addEventListener("meStateChange", _ => this.setState({}));
  }

  clickBackButton(evt) {
    evt.preventDefault();
    if (router.backUrlPrompt && !confirm(router.backUrlPrompt)) {
      return false;
    }
    router.onClick(evt);
  }

  render() {
    return (
      <div class="main-nav nav align-items-center z-index-100">
        <div class="navbar-block">
          {(["share"].includes(router.route) ||
            ["settings"].includes(router.action) ||
            !router.backUrl) && (
            <div
              class="menu dropdown cursor-pointer"
              tabindex="-1"
              onClick={e => e.currentTarget.classList.toggle("active")}
            >
              <div class="rounded-circle avatar unselectable">
                <img
                  class="rounded-circle"
                  style={util.backgroundHash(me.me.id)}
                  src={
                    me.me.avatar
                      ? util.crop(me.me.avatar["id"], 80, 80)
                      : util.defaultAvatar
                  }
                  onError={e => (e.currentTarget.src = util.defaultAvatar)}
                />
              </div>
              <div class="dropdown-menu dropdown-right">
                <a
                  class="d-block seamless-link"
                  href={router.toApp("/users/" + me.me.id + "/settings")}
                  onClick={e => router.onClick(e)}
                >
                  {lang.t("settings")}
                </a>
                <a
                  class="d-block seamless-link"
                  href={router.toApp("/logout")}
                  onClick={e => router.onClick(e)}
                >
                  {lang.t("logout")}
                </a>
              </div>
            </div>
          )}
          {["groups", "messages"].includes(router.route) && router.backUrl && (
            <a
              class="seamless-link back"
              href={router.toApp(router.backUrl)}
              onClick={e => this.clickBackButton(e)}
            >
              <FaIcon family={"solid"} icon={"arrow-left"} />
            </a>
          )}
          <NotificationsDropdownNavbar />
        </div>
        <Search />
        <GroupsDropdownNavbar />
      </div>
    );
  }
}
