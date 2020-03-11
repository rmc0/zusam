import { h, render, Component } from "preact";
import { lang, me, util } from "/core";
import { FaIcon } from "/misc";

export default class MessageHead extends Component {
  render() {
    return (
      <div class="message-head d-flex">
        <div>
          <img
            className={
              "rounded-circle material-shadow avatar" +
              (this.props.author.name ? "" : " removed-user")
            }
            style={util.backgroundHash(
              this.props.author.name ? this.props.author.id : ""
            )}
            src={
              this.props.author && this.props.author.avatar
                ? util.crop(this.props.author.avatar.id, 100, 100)
                : util.defaultAvatar
            }
            title={this.props.author.name || ""}
          />
        </div>
        {!this.props.isChild && (
          <div class="infos">
            <span class="capitalize author">
              {this.props.author.name || "--"}
            </span>
          </div>
        )}
      </div>
    );
  }
}
