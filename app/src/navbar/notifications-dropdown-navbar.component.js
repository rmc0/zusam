import { h, render, Component } from "preact";
import { lang, me, router, http } from "/core";
import { FaIcon } from "/misc";
import { Notification } from "/pages";

export default class NotificationsDropdownNavbar extends Component {
  constructor(props) {
    super(props);
    // force update the navbar when me gets updated
    addEventListener("meStateChange", _ => this.setState({}));
    this.clearAllNotifications = this.clearAllNotifications.bind(this);
  }

  clearAllNotifications() {
    if (me.me.notifications.length) {
      Promise.all(
        me.me.notifications.map(n => http.delete("/api/notifications/" + n.id))
      ).then(me.update());
    }
  }

  render() {
    return (
      <div
        className={
          "menu dropdown" +
          (me.me.notifications.length ? " cursor-pointer" : "")
        }
        tabindex="-1"
        onClick={e =>
          me.me.notifications.length &&
          e.currentTarget.classList.toggle("active")
        }
      >
        <div class="unselectable notification-button">
          <FaIcon
            family={me.me.notifications.length ? "solid" : "regular"}
            icon={"bell"}
          />
          {!!me.me.notifications.length && (
            <span class="notification-count">{me.me.notifications.length}</span>
          )}
        </div>
        <div class="dropdown-menu dropdown-right notifications-menu">
          <div class="notification-header">
            <strong class="capitalize">{lang.t("notifications")}</strong>
            <div
              class="action capitalize"
              onClick={e => this.clearAllNotifications()}
            >
              {lang.t("mark_all_as_read")}
            </div>
          </div>
          {me.me.notifications
            ? me.me.notifications
                .sort((a, b) => b.createdAt - a.createdAt)
                .map(e => <Notification key={e.id} {...e} />)
            : null}
        </div>
      </div>
    );
  }
}
