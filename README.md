Auto Collapse
=============

jQuery plugin to automatically collapse menus.


------

## Installation

Auto Collapse depends on jQuery. To use it, include this in your page :

    <script src="jquery.js" type="text/javascript"></script>
    <script src="auto-collapse.js" type="text/javascript"></script>


------

## Usage

When you call the plugin for the first time, it will check if the class `normalClass`, which is by default 'navbar-normal', is present on the element to determine if the menu is collapsed or not.

Each time the window is resized, the plugin will check if the menu can fit on one line. If not it will apply the `responsiveClass`, which is by default 'navbar-responsive'. It will also search for links matching the `dropdownLinkSelector`, which is by default '.dropdown > a', and make them dropdown menus.

Here is how you can call the plugin:

    $(function() {
      $('.navbar').autoCollapse();
    });


------

## Options


### normalClass *{string}*

Class to apply when the menu is not collapsed.


### responsiveClass *{string}*

Class to apply when the menu is collapsed.


### dropdownLinkSelector *{string}*

Selector to use to find dropdown links in the menu.


### updateOnResize  *{boolean}*

Set to false if you want to handle yourself when to check if the menu should be collapsed.


------

## Author

**Nicolas Badia**

+ [https://twitter.com/@nicolas_badia](https://twitter.com/@nicolas_badia)
+ [https://github.com/nicolasbadia](https://github.com/nicolasbadia)

------

## Copyright and license

Copyright 2013-2015 GestiXi under [The MIT License (MIT)](LICENSE).
