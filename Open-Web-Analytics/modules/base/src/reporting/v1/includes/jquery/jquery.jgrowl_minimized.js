(function ($) {
  $.jGrowl = function (m, o) {
    if ($('#jGrowl').size() == 0)
      $('<div id="jGrowl"></div>').addClass($.jGrowl.defaults.position).appendTo('body');
    $('#jGrowl').jGrowl(m, o);
  };
  $.fn.jGrowl = function (m, o) {
    if ($.isFunction(this.each)) {
      var args = arguments;
      return this.each(function () {
        var self = this;
        if ($(this).data('jGrowl.instance') == undefined) {
          $(this).data(
            'jGrowl.instance',
            $.extend(new $.fn.jGrowl(), { notifications: [], element: null, interval: null })
          );
          $(this).data('jGrowl.instance').startup(this);
        }
        if ($.isFunction($(this).data('jGrowl.instance')[m])) {
          $(this)
            .data('jGrowl.instance')
            [m].apply($(this).data('jGrowl.instance'), $.makeArray(args).slice(1));
        } else {
          $(this).data('jGrowl.instance').create(m, o);
        }
      });
    }
  };
  $.extend($.fn.jGrowl.prototype, {
    defaults: {
      pool: 0,
      header: '',
      group: '',
      sticky: false,
      position: 'top-right',
      glue: 'after',
      theme: 'default',
      corners: '10px',
      check: 250,
      life: 3000,
      speed: 'normal',
      easing: 'swing',
      closer: true,
      closeTemplate: '&times;',
      closerTemplate: '<div>[ close all ]</div>',
      log: function (e, m, o) {},
      beforeOpen: function (e, m, o) {},
      open: function (e, m, o) {},
      beforeClose: function (e, m, o) {},
      close: function (e, m, o) {},
      animateOpen: { opacity: 'show' },
      animateClose: { opacity: 'hide' },
    },
    notifications: [],
    element: null,
    interval: null,
    create: function (message, o) {
      var o = $.extend({}, this.defaults, o);
      this.notifications[this.notifications.length] = { message: message, options: o };
      o.log.apply(this.element, [this.element, message, o]);
    },
    render: function (notification) {
      var self = this;
      var message = notification.message;
      var o = notification.options;
      var notification = $(
        '<div class="jGrowl-notification' +
          (o.group != undefined && o.group != '' ? ' ' + o.group : '') +
          '"><div class="close">' +
          o.closeTemplate +
          '</div><div class="header">' +
          o.header +
          '</div><div class="message">' +
          message +
          '</div></div>'
      )
        .data('jGrowl', o)
        .addClass(o.theme)
        .children('div.close')
        .bind('click.jGrowl', function () {
          $(this).parent().trigger('jGrowl.close');
        })
        .parent();
      o.glue == 'after'
        ? $('div.jGrowl-notification:last', this.element).after(notification)
        : $('div.jGrowl-notification:first', this.element).before(notification);
      $(notification)
        .bind('mouseover.jGrowl', function () {
          $(this).data('jGrowl').pause = true;
        })
        .bind('mouseout.jGrowl', function () {
          $(this).data('jGrowl').pause = false;
        })
        .bind('jGrowl.beforeOpen', function () {
          o.beforeOpen.apply(self.element, [self.element, message, o]);
        })
        .bind('jGrowl.open', function () {
          o.open.apply(self.element, [self.element, message, o]);
        })
        .bind('jGrowl.beforeClose', function () {
          o.beforeClose.apply(self.element, [self.element, message, o]);
        })
        .bind('jGrowl.close', function () {
          $(this).data('jGrowl').pause = true;
          $(this)
            .trigger('jGrowl.beforeClose')
            .animate(o.animateClose, o.speed, o.easing, function () {
              $(this).remove();
              o.close.apply(self.element, [self.element, message, o]);
            });
        })
        .trigger('jGrowl.beforeOpen')
        .animate(o.animateOpen, o.speed, o.easing, function () {
          $(this).data('jGrowl').created = new Date();
        })
        .trigger('jGrowl.open');
      if ($.fn.corner != undefined) $(notification).corner(o.corners);
      if (
        $('div.jGrowl-notification:parent', this.element).size() > 1 &&
        $('div.jGrowl-closer', this.element).size() == 0 &&
        this.defaults.closer != false
      ) {
        $(this.defaults.closerTemplate)
          .addClass('jGrowl-closer')
          .addClass(this.defaults.theme)
          .appendTo(this.element)
          .animate(this.defaults.animateOpen, this.defaults.speed, this.defaults.easing)
          .bind('click.jGrowl', function () {
            $(this).siblings().children('div.close').trigger('click.jGrowl');
            if ($.isFunction(self.defaults.closer))
              self.defaults.closer.apply($(this).parent()[0], [$(this).parent()[0]]);
          });
      }
    },
    update: function () {
      $(this.element)
        .find('div.jGrowl-notification:parent')
        .each(function () {
          if (
            $(this).data('jGrowl') != undefined &&
            $(this).data('jGrowl').created != undefined &&
            $(this).data('jGrowl').created.getTime() + $(this).data('jGrowl').life <
              new Date().getTime() &&
            $(this).data('jGrowl').sticky != true &&
            ($(this).data('jGrowl').pause == undefined || $(this).data('jGrowl').pause != true)
          ) {
            $(this).trigger('jGrowl.close');
          }
        });
      if (
        this.notifications.length > 0 &&
        (this.defaults.pool == 0 ||
          $(this.element).find('div.jGrowl-notification:parent').size() < this.defaults.pool)
      ) {
        this.render(this.notifications.shift());
      }
      if ($(this.element).find('div.jGrowl-notification:parent').size() < 2) {
        $(this.element)
          .find('div.jGrowl-closer')
          .animate(
            this.defaults.animateClose,
            this.defaults.speed,
            this.defaults.easing,
            function () {
              $(this).remove();
            }
          );
      }
    },
    startup: function (e) {
      this.element = $(e).addClass('jGrowl').append('<div class="jGrowl-notification"></div>');
      this.interval = setInterval(function () {
        $(e).data('jGrowl.instance').update();
      }, this.defaults.check);
      if ($.browser.msie && parseInt($.browser.version) < 7 && !window['XMLHttpRequest'])
        $(this.element).addClass('ie6');
    },
    shutdown: function () {
      $(this.element).removeClass('jGrowl').find('div.jGrowl-notification').remove();
      clearInterval(this.interval);
    },
  });
  $.jGrowl.defaults = $.fn.jGrowl.prototype.defaults;
})(jQuery);
