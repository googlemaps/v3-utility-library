/**
 * This class represents the object for values in the <code>styles</code> array passed
 * to the {@link MarkerClusterer} constructor. The element in this array that is used to
 * style the cluster icon is determined by calling the <code>calculator</code> function.
 */
import { Cluster } from './cluster';
import { OverlayViewSafe } from './overlay-view-safe';

export interface ClusterIconStyle {
  /** The URL of the cluster icon image file. Required. */
  url: string;
  /** Height The display height (in pixels) of the cluster icon. Required. */
  height: number;
  /** Width The display width (in pixels) of the cluster icon. Required. */
  width: number;
  /**
   * [anchorText] The position (in pixels) from the center of the cluster icon to
   * where the text label is to be centered and drawn. The format is <code>[yoffset, xoffset]</code>
   * where <code>yoffset</code> increases as you go down from center and <code>xoffset</code>
   * increases to the right of center. The default is <code>[0, 0]</code>.
   */
  anchorText?: [number, number];
  /**
   * [anchorIcon] The anchor position (in pixels) of the cluster icon. This is the
   * spot on the cluster icon that is to be aligned with the cluster position. The format is
   * <code>[yoffset, xoffset]</code> where <code>yoffset</code> increases as you go down and
   * <code>xoffset</code> increases to the right of the top-left corner of the icon. The default
   * anchor position is the center of the cluster icon.
   */
  anchorIcon?: [number, number];
  /** [textColor="black"] The color of the label text shown on the cluster icon. */
  textColor?: string;
  /** textSize=11] The size (in pixels) of the label text shown on the cluster icon. */
  textSize?: number;
  /**
   * [textDecoration="none"] The value of the CSS <code>text-decoration</code>
   * property for the label text shown on the cluster icon.
   */
  textDecoration?: string;
  /**
   * [fontWeight="bold"] The value of the CSS <code>font-weight</code>
   * property for the label text shown on the cluster icon.
   */
  fontWeight?: string;
  /**
   * [fontStyle="normal"] The value of the CSS <code>font-style</code>
   *  property for the label text shown on the cluster icon.
   */
  fontStyle?: string;
  /**
   * [fontFamily="Arial,sans-serif"] The value of the CSS <code>font-family</code>
   *  property for the label text shown on the cluster icon.
   */
  fontFamily?: string;
  /**
   * [backgroundPosition="0 0"] The position of the cluster icon image
   * within the image defined by <code>url</code>. The format is <code>"xpos ypos"</code>
   * (the same format as for the CSS <code>background-position</code> property). You must set
   * this property appropriately when the image defined by <code>url</code> represents a sprite
   * containing multiple images. Note that the position <i>must</i> be specified in px units.
   */
  backgroundPosition?: string;
}

/**
 * @description This is an object containing general information about a cluster icon. This is
 *  the object that a <code>calculator</code> function returns.
 */
export interface ClusterIconInfo {
  /**
   * The text of the label to be shown on the cluster icon.
   */
  text: string;
  /**
   * The index plus 1 of the element in the <code>styles</code>
   */
  index: number;
  /**
   * The tooltip to display when the mouse moves over the cluster icon.
   * If this value is <code>undefined</code> or <code>""</code>, <code>title</code> is set to the
   * value of the <code>title</code> property passed to the MarkerClusterer.
   */
  title: string;
}

/**
 * A cluster icon.
 *
 * @constructor
 * @extends google.maps.OverlayView
 * @param {Cluster} cluster The cluster with which the icon is to be associated.
 * @param {ClusterIconStyle[]} [styles] An array of {@link ClusterIconStyle} defining the cluster icons
 *  to use for various cluster sizes.
 * @private
 * @internal
 */
export class ClusterIcon extends OverlayViewSafe {
  private className_ = this.cluster_.getMarkerClusterer().getClusterClass();
  private center_: google.maps.LatLng = null;
  private div_: HTMLDivElement = null;
  private sums_: ClusterIconInfo = null;
  private visible_ = false;

  private url_: string;
  private height_: number;
  private width_: number;
  private anchorText_: [number, number];
  private anchorIcon_: [number, number];
  private textColor_: string;
  private textSize_: number;
  private textDecoration_: string;
  private fontWeight_: string;
  private fontStyle_: string;
  private fontFamily_: string;
  private backgroundPosition_: string;

  private boundsChangedListener_: google.maps.MapsEventListener;

  constructor(private cluster_: Cluster, private styles_: ClusterIconStyle[]) {
    super();

    this.setMap(cluster_.getMap()); // Note: this causes onAdd to be called
  }

  /**
   * Adds the icon to the DOM.
   */
  onAdd(): void {
    const cClusterIcon = this;
    let cMouseDownInCluster: boolean;
    let cDraggingMapByCluster: boolean;
    const [major, minor] = google.maps.version.split(".");

    const gmVersion = (parseInt(major, 10) * 100) + parseInt(minor, 10);

    this.div_ = document.createElement("div");
    this.div_.className = this.className_;
    if (this.visible_) {
      this.show();
    }

    this.getPanes().overlayMouseTarget.appendChild(this.div_);

    // Fix for Issue 157
    this.boundsChangedListener_ = google.maps.event.addListener(
      this.getMap(),
      "bounds_changed",
      function() {
        cDraggingMapByCluster = cMouseDownInCluster;
      }
    );

    google.maps.event.addDomListener(this.div_, "mousedown", function() {
      cMouseDownInCluster = true;
      cDraggingMapByCluster = false;
    });

    // March 1, 2018: Fix for this 3.32 exp bug, https://issuetracker.google.com/issues/73571522
    // But it doesn't work with earlier releases so do a version check.
    if (gmVersion >= 332) {
      // Ugly version-dependent code
      google.maps.event.addDomListener(this.div_, "touchstart", function(e) {
        e.stopPropagation();
      });
    }

    google.maps.event.addDomListener(this.div_, "click", function(e) {
      cMouseDownInCluster = false;
      if (!cDraggingMapByCluster) {
        const mc = cClusterIcon.cluster_.getMarkerClusterer();
        /**
         * This event is fired when a cluster marker is clicked.
         * @name MarkerClusterer#click
         * @param {Cluster} c The cluster that was clicked.
         * @event
         */
        google.maps.event.trigger(mc, "click", cClusterIcon.cluster_);
        google.maps.event.trigger(mc, "clusterclick", cClusterIcon.cluster_); // deprecated name

        // The default click handler follows. Disable it by setting
        // the zoomOnClick property to false.
        if (mc.getZoomOnClick()) {
          // Zoom into the cluster.
          const mz = mc.getMaxZoom();
          const theBounds = cClusterIcon.cluster_.getBounds();
          (mc.getMap() as google.maps.Map).fitBounds(theBounds);
          // There is a fix for Issue 170 here:
          setTimeout(function() {
            (mc.getMap() as google.maps.Map).fitBounds(theBounds);
            // Don't zoom beyond the max zoom level
            if (mz !== null && mc.getMap().getZoom() > mz) {
              mc.getMap().setZoom(mz + 1);
            }
          }, 100);
        }

        // Prevent event propagation to the map:
        e.cancelBubble = true;
        if (e.stopPropagation) {
          e.stopPropagation();
        }
      }
    });

    google.maps.event.addDomListener(this.div_, "mouseover", function() {
      const mc = cClusterIcon.cluster_.getMarkerClusterer();
      /**
       * This event is fired when the mouse moves over a cluster marker.
       * @name MarkerClusterer#mouseover
       * @param {Cluster} c The cluster that the mouse moved over.
       * @event
       */
      google.maps.event.trigger(mc, "mouseover", cClusterIcon.cluster_);
    });

    google.maps.event.addDomListener(this.div_, "mouseout", function() {
      const mc = cClusterIcon.cluster_.getMarkerClusterer();
      /**
       * This event is fired when the mouse moves out of a cluster marker.
       * @name MarkerClusterer#mouseout
       * @param {Cluster} c The cluster that the mouse moved out of.
       * @event
       */
      google.maps.event.trigger(mc, "mouseout", cClusterIcon.cluster_);
    });
  }

  /**
   * Removes the icon from the DOM.
   */
  onRemove(): void {
    if (this.div_ && this.div_.parentNode) {
      this.hide();
      google.maps.event.removeListener(this.boundsChangedListener_);
      google.maps.event.clearInstanceListeners(this.div_);
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  }

  /**
   * Draws the icon.
   */
  draw(): void {
    if (this.visible_) {
      const pos = this.getPosFromLatLng_(this.center_);
      this.div_.style.top = pos.y + "px";
      this.div_.style.left = pos.x + "px";
    }
  }

  /**
   * Hides the icon.
   */
  hide(): void {
    if (this.div_) {
      this.div_.style.display = "none";
    }
    this.visible_ = false;
  }

  /**
   * Positions and shows the icon.
   */
  show(): void {
    if (this.div_) {
      const mc = this.cluster_.getMarkerClusterer();
      const ariaLabel = mc.ariaLabelFn(this.sums_.text);
      // NOTE: values must be specified in px units
      const bp = this.backgroundPosition_.split(" ");
      const spriteH = parseInt(bp[0].replace(/^\s+|\s+$/g, ""), 10);
      const spriteV = parseInt(bp[1].replace(/^\s+|\s+$/g, ""), 10);
      this.div_.style.cssText = this.createCss(this.getPosFromLatLng_(this.center_));


      let imgDimensions = '';
      if (this.cluster_.getMarkerClusterer().getEnableRetinaIcons()) {
        imgDimensions = `width: ${this.width_}px; height: ${this.height_}px`;
      } else {
        const [Y1, X1, Y2, X2] = [
          -1 * spriteV,
          -1 * spriteH + this.width_,
          -1 * spriteV + this.height_,
          -1 * spriteH,
        ];

        imgDimensions = `clip: rect(${Y1}px, ${X1}px, ${Y2}px, ${X2}px)`;
      }

      const imgStyle = [
        `position: absolute`,
        `top: ${spriteV}px`,
        `left: ${spriteH}px`,
        imgDimensions,
      ].join(";");

      const divStyle = [
        `position: absolute`,
        `top: ${this.anchorText_[0]}px`,
        `left: ${this.anchorText_[1]}px`,
        `color: ${this.textColor_}`,
        `font-size: ${this.textSize_}px`,
        `font-family: ${this.fontFamily_}`,
        `font-weight: ${this.fontWeight_}`,
        `font-style: ${this.fontStyle_}`,
        `text-decoration: ${this.textDecoration_}`,
        `text-align: center`,
        `width: ${this.width_}px`,
        `line-height: ${this.height_}px`,
      ].join(";");

      this.div_.innerHTML = `
<img alt='${this.sums_.text}' aria-hidden="true" src="${this.url_}" style="${imgStyle}"/>
<div aria-label="${ariaLabel}" tabindex="0" style="${divStyle}">
  <span aria-hidden="true">${this.sums_.text}</span>
</div>
`;
      if (typeof this.sums_.title === 'undefined' || this.sums_.title === '') {
        this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
      } else {
        this.div_.title = this.sums_.title;
      }
      this.div_.style.display = "";
    }
    this.visible_ = true;
  }

  /**
   * Sets the icon styles to the appropriate element in the styles array.
   *
   * @param {ClusterIconInfo} sums The icon label text and styles index.
   */
  useStyle(sums: ClusterIconInfo): void {
    this.sums_ = sums;
    let index = Math.max(0, sums.index - 1);
    index = Math.min(this.styles_.length - 1, index);
    const style = this.styles_[index];
    this.url_ = style.url;
    this.height_ = style.height;
    this.width_ = style.width;
    this.anchorText_ = style.anchorText || [0, 0];
    this.anchorIcon_ = style.anchorIcon || [
      Math.floor(this.height_ / 2),
      Math.floor(this.width_ / 2)
    ];
    this.textColor_ = style.textColor || "black";
    this.textSize_ = style.textSize || 11;
    this.textDecoration_ = style.textDecoration || "none";
    this.fontWeight_ = style.fontWeight || "bold";
    this.fontStyle_ = style.fontStyle || "normal";
    this.fontFamily_ = style.fontFamily || "Arial,sans-serif";
    this.backgroundPosition_ = style.backgroundPosition || "0 0";
  }

  /**
   * Sets the position at which to center the icon.
   *
   * @param {google.maps.LatLng} center The latlng to set as the center.
   */
  setCenter(center: google.maps.LatLng): void {
    this.center_ = center;
  }

  /**
   * Creates the cssText style parameter based on the position of the icon.
   *
   * @param {google.maps.Point} pos The position of the icon.
   * @return {string} The CSS style text.
   */
  createCss(pos: google.maps.Point): string {
    return [
     `z-index: ${this.cluster_.getMarkerClusterer().getZIndex()}`,
     "cursor: pointer",
     `position: absolute; top: ${pos.y}px; left: ${pos.x}px`,
     `width: ${this.width_}px; height: ${this.height_}px`,
     "-webkit-user-select: none",
     "-khtml-user-select: none",
     "-moz-user-select: none",
     "-o-user-select: none",
     "user-select: none",
    ].join(";");
  }

  /**
   * Returns the position at which to place the DIV depending on the latlng.
   *
   * @param {google.maps.LatLng} latlng The position in latlng.
   * @return {google.maps.Point} The position in pixels.
   */
  getPosFromLatLng_(latlng: google.maps.LatLng): google.maps.Point {
    const pos = this.getProjection().fromLatLngToDivPixel(latlng);
    pos.x = Math.floor(pos.x - this.anchorIcon_[1]);
    pos.y = Math.floor(pos.y - this.anchorIcon_[0]);
    return pos;
  }
}
