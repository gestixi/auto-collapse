// ==========================================================================
// Project:     Auto Collapse
// Description: jQuery plugin to automatically collapse menus
// Copyright:   ©2012-2018 GestiXi
// License:     Licensed under the MIT license (see LICENCE)
// Version:     1.0.1
// Author:      Nicolas BADIA
// ==========================================================================

!function ($) { "use strict";

  // ..........................................................
  // AUTO COLLAPSE PLUGIN DEFINITION
  //

  $.fn.autoCollapse = function ( option ) {

    return this.each(function () {
      var $this = $(this),
          data = $this.data('autoCollapse');

      if (!data) {
        // Prevent calling the plugin on a clone
        if ($this.hasClass('auto-collapse-clone')) return;

        var options = $.extend({}, $.fn.autoCollapse.defaults, typeof option == 'object' && option);

        $this.data('autoCollapse', (data = new AutoCollapse(this, options)));

        if (options.updateOnResize) {
          $(window).resize(function(e) { data.scheduleUpdate(); });
        }
      }

      data.update();
    })
  }

  $.fn.autoCollapse.defaults = {
    /**
      Class to apply when the menu is not collapsed.
    */
    normalClass: 'navbar-normal',

    /**
      Class to apply when the menu is collapsed.
    */
    responsiveClass: 'navbar-responsive',

    /**
      Selector to use to find dropdown links in the menu.
    */
    dropdownLinkSelector: '.dropdown > a',

    /**
      Delegate to determine if the menu should be collapsed.
    */
    shouldCollapseDelegate: function($element) {
      var that = this,
        $nav = $element.find('ul'),
        navHeight = $nav.height(),
        $navItem = $nav.find('li'),
        navItemHeight = $navItem.outerHeight(true),
        needCollapse = navHeight > navItemHeight;

      // If the case where the font is not loaded, update a few time during about 10 sec just in case.
      if (!that.r) that.r = 0;
      if (that.r < 9) {
        setTimeout(function() { that.update() }, 50*that.r*that.r);
        that.r++;
      }
      return needCollapse;
    },

    /**
      Set to false if you want to handle yourself when to check if
      the menu should be collapsed.
    */
    updateOnResize: true
  }

  // ..........................................................
  // AUTO COLLAPSE PUBLIC CLASS DEFINITION
  //

  var AutoCollapse = function (element, options) {
    this.options = options;

    var $element = this.$element = $(element),
        $clone = this.$clone = $element.clone(),
        $links = this.$links = $element.find(options.dropdownLinkSelector);

    $links.each(function() {
      $.data(this, "href", $(this).attr('href'));
      $.data(this, "hasDropDownClass", $(this).hasClass('dropdown-toggle'));
      $.data(this, "hasDropDownData", $(this).attr('data-toggle') === 'dropdown');
    });

    // Create a clone to mesure the height of the menu not collapsed
    $clone.css({ opacity: 0, display: 'none', 'pointer-events': 'none' });
    $clone.addClass('auto-collapse-clone');
    $clone.appendTo($element.parent());

    this.isNormal = $element.hasClass(options.normalClass);
  }


  $.fn.autoCollapse.Constructor = AutoCollapse


  AutoCollapse.prototype = {

    constructor: AutoCollapse,

    /**
      Flag to know if the menu is collapsed or not.
    */
    isNormal: null,

    /**
      Check the menu.
    */
    update: function() {
      this._didScheduleUpdate = false;

      var options = this.options,
        $clone = this.$clone,
        didChange;

      $clone.css({ display: 'block' });

      var collapse = options.shouldCollapseDelegate.call(this, $clone);

      $clone.css({ display: 'none' });

      if (collapse) {
        didChange = this.makeResponsive();
      }
      else {
        didChange = this.makeNormal();
      }

      if (didChange) this.updateMargin();
    },

    /**
      Collapse the menu.
    */
    makeResponsive: function() {
      if (this.isNormal === false) return false;
      this.isNormal = false;

      var options = this.options,
        $element = this.$element;

      $element.removeClass(options.normalClass).addClass(options.responsiveClass);

      this.$links.each(function() {
        $(this).attr('href', '#').addClass('dropdown-toggle').attr('data-toggle', 'dropdown');
      });
      return true;
    },

    /**
      Uncollapse the menu.
    */
    makeNormal: function() {
      if (this.isNormal === true) return false;
      this.isNormal = true;

      var $element = this.$element,
          options = this.options;

      $element.removeClass(options.responsiveClass).addClass(options.normalClass);

      this.$links.each(function() {
        $(this).attr('href',  $.data(this, "href"));

        if (!$.data(this, "hasDropDownClass")) $(this).removeClass('dropdown-toggle');
        if (!$.data(this, "hasDropDownData")) $(this).removeAttr('data-toggle');
      });
      return true;
    },

    /**
      Adjust the margin-left and right of navbar-collapse
    */
    updateMargin: function() {
      var isNormal = this.isNormal,
          $element = this.$element,
          options = this.options,
          $collapse = $element.find('.collapse'),
          initialMargin = this._initialMargin;

      if (initialMargin == null) {
        initialMargin = this._initialMargin = {
          left: $collapse.css('margin-left'),
          right: $collapse.css('margin-right')
        };
      }

      var marginLeft = initialMargin.left,
        marginRight = initialMargin.right;

      if (!isNormal) {
        var offset = $element.offset(),
            offsetLeft = offset.left,
            offsetRight = ($(window).width() - (offsetLeft + $element.outerWidth()));

        marginLeft = -offsetLeft;
        marginRight = -offsetRight;
      }

      $collapse.css({ 'margin-left': marginLeft, 'margin-right': marginRight });
    },

    /**
      @private

      Schedule an update.
    */
    scheduleUpdate: function() {
      if (this._didScheduleUpdate) return;

      if (window.requestAnimationFrame) {
        var that = this;
        this._didScheduleUpdate = true;
        requestAnimationFrame(function() { that.update(); });
      }
      else {
        this.update();
      }
    }

  }


}(window.jQuery);
