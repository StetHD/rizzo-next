import { Component } from "../../core/bane";
import VideoOverlay from "../video_overlay";

/**
 * Video Poster Button Component
*/
export default class VideoPosterButtonComponent extends Component {
    initialize () {
        this.overlay = new VideoOverlay({el: ".video-overlay"});

        this.events = {
            "click .video-poster-button__inner": "onClick"
        };

        this.listenTo(this.overlay, "video.loaded", this.onVideoLoaded);
    }

    render () {
        let title = "";
        let image = null;

        try {
            let mediainfo = this.overlay.player.player.mediainfo;
            title = mediainfo.name;
            image = mediainfo.poster;
        }
        catch (e) {
        }

        this.$el.find(".video-poster-button__poster").attr("src", image);
        this.$el.find(".video-poster-button__title").text(title);

        if (!image) {
            this.$el.removeClass("video-poster-button--visible");
        }
        else {
            this.$el.addClass("video-poster-button--visible");
        }
        
        return this;
    }

    onClick (e) {
        e.preventDefault();
        this.overlay.show();
    }

    onVideoLoaded () {
        this.render();
    }
}