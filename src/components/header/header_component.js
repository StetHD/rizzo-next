import { Component } from "../../core/bane";
import SearchComponent from "../search";
import NavigationComponent from "../navigation";
import NavigationState from "../navigation/navigation_state";
import $ from "jquery";
import debounce from "lodash/debounce";

/**
 * The page header which contains both search and navigation.
 * Clicking on the search icons opens the search.
 * Will re-render when the browser changes sizes
 */
class Header extends Component {

  initialize(options) {
    this.lazyLoadGlobalComponents = this.lazyLoadGlobalComponents.bind(this);
    this.state = NavigationState.getState();
    this.search = new SearchComponent();
    this.navigation = new NavigationComponent({
      el: $(".navigation")
    });

    this.events = {
      "click .js-lp-global-header-search": "onSearchClick",
      "click .js-lp-global-header-search .navigation__link": "onSearchClick",
      "click .js-menu": "onMobileMenuClick"
    };

    this.$search = this.$el.find(".js-lp-global-header-search");
    this.$inner = this.$el.find(".js-lp-global-header-inner");

    $(window).resize(debounce(this.render.bind(this), 100));
    this.render();

    this.$mobileNotificationBadge = require("./mobile_notification_badge.hbs");

    this.appendMenuIcon();
    this.buildGlobalComponents(options);
  }

  buildGlobalComponents(options = {}) {
    this.lazyLoadGlobalComponents(options);

    $(document).on("touchstart", "a[href*='login']", () => {
      this.navigation._clickNav();
    });
  }

  lazyLoadGlobalComponents(options) {
    require.ensure([], (require) => {
      const render = require("@lonelyplanet/dotcom-core/dist/classes/runtime").default;

      const modal = document.createElement("div");
      modal.id = "lp-global-modal-login";
      document.body.appendChild(modal);

      render({
        component: "GlobalLogin",
        el: modal,
        props: options,
      });

      // TODO: Add logic for toast
      /*
      const toastMessage = localStorage.getItem("toast");
      if (toastMessage) {
        console.log(toastMessage);
        localStorage.removeItem("toast");
      }
      */
    });
  }

  /**
   * Add a class to the search when it's too big for the screen
   * @return {Header} The instance of the header
   */
  render() {
    let fadeClassName = "lp-global-header__search--fade";

    this.$search
        .removeClass(fadeClassName)
        .toggleClass(fadeClassName, this.isTooBig());

    return this;
  }
  /**
   * If the search box is too big based on the screen width
   * @return {Boolean}
   */
  isTooBig() {
    return this.$search.width() > this.$inner.width() * .42;
  }

  onSearchClick(e) {
    e.preventDefault();

    this.search.show();
  }

  onMobileMenuClick(e){
    e.preventDefault();

    this.navigation._clickNav();
  }

  appendMenuIcon() {
    if(this.state.cartItemCount) {
      $(".js-lp-global-header-mobile").prepend(this.$mobileNotificationBadge);
    }
  }
}

export default Header;
