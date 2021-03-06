import { h, render, Component } from "preact";
import { http, router } from "/core";
import { MessageParent } from "/message";

export default class Public extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.token) {
      http
        .get("/api/public/" + this.props.token)
        .then(res => this.setState({ message: res }));
    }
  }

  render() {
    if (!this.state.message) {
      return;
    }
    return (
      <article class="justify-content-center d-flex mt-2">
        <div class="container">
          <MessageParent
            isPublic={true}
            key={this.state.message.id}
            message={this.state.message}
          />
        </div>
      </article>
    );
  }
}
