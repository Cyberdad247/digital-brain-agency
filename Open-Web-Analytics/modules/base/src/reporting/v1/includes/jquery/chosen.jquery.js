// Chosen, a Select Box Enhancer for jQuery and Protoype
// by Patrick Filler for Harvest, http://getharvest.com
//
// Version 0.9.6
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
(function () {
  var SelectParser;
  SelectParser = (function () {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }
    SelectParser.prototype.add_node = function (child) {
      if (child.nodeName === 'OPTGROUP') {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };
    SelectParser.prototype.add_group = function (group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled,
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };
    SelectParser.prototype.add_option = function (option, group_position, group_disabled) {
      if (option.nodeName === 'OPTION') {
        if (option.text !== '') {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText,
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true,
          });
        }
        return (this.options_index += 1);
      }
    };
    return SelectParser;
  })();
  SelectParser.select_to_array = function (select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };
  this.SelectParser = SelectParser;
}).call(this);
(function () {
  /*
  Chosen source: generate output using 'cake build'
  Copyright (c) 2011 by Harvest
  */
  var AbstractChosen, root;
  var __bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };
  root = this;
  AbstractChosen = (function () {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      this.set_default_values();
      this.is_multiple = this.form_field.multiple;
      this.default_text_default = this.is_multiple ? 'Select Some Options' : 'Select an Option';
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.finish_setup();
    }
    AbstractChosen.prototype.set_default_values = function () {
      this.click_test_action = __bind(function (evt) {
        return this.test_active_click(evt);
      }, this);
      this.activate_action = __bind(function (evt) {
        return this.activate_field(evt);
      }, this);
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.allow_single_deselect =
        this.options.allow_single_deselect != null &&
        this.form_field.options[0] != null &&
        this.form_field.options[0].text === ''
          ? this.options.allow_single_deselect
          : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.choices = 0;
      return (this.results_none_found = this.options.no_results_text || 'No results match');
    };
    AbstractChosen.prototype.mouse_enter = function () {
      return (this.mouse_on_container = true);
    };
    AbstractChosen.prototype.mouse_leave = function () {
      return (this.mouse_on_container = false);
    };
    AbstractChosen.prototype.input_focus = function (evt) {
      if (!this.active_field) {
        return setTimeout(
          __bind(function () {
            return this.container_mousedown();
          }, this),
          50
        );
      }
    };
    AbstractChosen.prototype.input_blur = function (evt) {
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout(
          __bind(function () {
            return this.blur_test();
          }, this),
          100
        );
      }
    };
    AbstractChosen.prototype.result_add_option = function (option) {
      var classes, style;
      if (!option.disabled) {
        option.dom_id = this.container_id + '_o_' + option.array_index;
        classes = option.selected && this.is_multiple ? [] : ['active-result'];
        if (option.selected) {
          classes.push('result-selected');
        }
        if (option.group_array_index != null) {
          classes.push('group-option');
        }
        if (option.classes !== '') {
          classes.push(option.classes);
        }
        style = option.style.cssText !== '' ? ' style="' + option.style + '"' : '';
        return (
          '<li id="' +
          option.dom_id +
          '" class="' +
          classes.join(' ') +
          '"' +
          style +
          '>' +
          option.html +
          '</li>'
        );
      } else {
        return '';
      }
    };
    AbstractChosen.prototype.results_update_field = function () {
      this.result_clear_highlight();
      this.result_single_selected = null;
      return this.results_build();
    };
    AbstractChosen.prototype.results_toggle = function () {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.results_search = function (evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.keyup_checker = function (evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };
    AbstractChosen.prototype.generate_field_id = function () {
      var new_id;
      new_id = this.generate_random_id();
      this.form_field.id = new_id;
      return new_id;
    };
    AbstractChosen.prototype.generate_random_char = function () {
      var chars, newchar, rand;
      chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
      rand = Math.floor(Math.random() * chars.length);
      return (newchar = chars.substring(rand, rand + 1));
    };
    return AbstractChosen;
  })();
  root.AbstractChosen = AbstractChosen;
}).call(this);
(function () {
  /*
  Chosen source: generate output using 'cake build'
  Copyright (c) 2011 by Harvest
  */
  var $, Chosen, get_side_border_padding, root;
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function (child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    __bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    };
  root = this;
  $ = jQuery;
  $.fn.extend({
    chosen: function (options) {
      if ($.browser.msie && ($.browser.version === '6.0' || $.browser.version === '7.0')) {
        return this;
      }
      return $(this).each(function (input_field) {
        if (!$(this).hasClass('chzn-done')) {
          return new Chosen(this, options);
        }
      });
    },
  });
  Chosen = (function () {
    __extends(Chosen, AbstractChosen);
    function Chosen() {
      Chosen.__super__.constructor.apply(this, arguments);
    }
    Chosen.prototype.setup = function () {
      this.form_field_jq = $(this.form_field);
      return (this.is_rtl = this.form_field_jq.hasClass('chzn-rtl'));
    };
    Chosen.prototype.finish_setup = function () {
      return this.form_field_jq.addClass('chzn-done');
    };
    Chosen.prototype.set_up_html = function () {
      var container_div, dd_top, dd_width, sf_width;
      this.container_id = this.form_field.id.length
        ? this.form_field.id.replace(/(:|\.)/g, '_')
        : this.generate_field_id();
      this.container_id += '_chzn';
      this.f_width = this.form_field_jq.outerWidth();
      this.default_text = this.form_field_jq.data('placeholder')
        ? this.form_field_jq.data('placeholder')
        : this.default_text_default;
      container_div = $('<div />', {
        id: this.container_id,
        class: 'chzn-container' + (this.is_rtl ? ' chzn-rtl' : ''),
        style: 'width: ' + this.f_width + 'px;',
      });
      if (this.is_multiple) {
        container_div.html(
          '<ul class="chzn-choices"><li class="search-field"><input type="text" value="' +
            this.default_text +
            '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>'
        );
      } else {
        container_div.html(
          '<a href="javascript:void(0)" class="chzn-single"><span>' +
            this.default_text +
            '</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>'
        );
      }
      this.form_field_jq.hide().after(container_div);
      this.container = $('#' + this.container_id);
      this.container.addClass('chzn-container-' + (this.is_multiple ? 'multi' : 'single'));
      this.dropdown = this.container.find('div.chzn-drop').first();
      dd_top = this.container.height();
      dd_width = this.f_width - get_side_border_padding(this.dropdown);
      this.dropdown.css({
        width: dd_width + 'px',
        top: dd_top + 'px',
      });
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chzn-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chzn-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chzn-search').first();
        this.selected_item = this.container.find('.chzn-single').first();
        sf_width =
          dd_width -
          get_side_border_padding(this.search_container) -
          get_side_border_padding(this.search_field);
        this.search_field.css({
          width: sf_width + 'px',
        });
      }
      this.results_build();
      this.set_tab_index();
      return this.form_field_jq.trigger('liszt:ready', {
        chosen: this,
      });
    };
    Chosen.prototype.register_observers = function () {
      this.container.mousedown(
        __bind(function (evt) {
          return this.container_mousedown(evt);
        }, this)
      );
      this.container.mouseup(
        __bind(function (evt) {
          return this.container_mouseup(evt);
        }, this)
      );
      this.container.mouseenter(
        __bind(function (evt) {
          return this.mouse_enter(evt);
        }, this)
      );
      this.container.mouseleave(
        __bind(function (evt) {
          return this.mouse_leave(evt);
        }, this)
      );
      this.search_results.mouseup(
        __bind(function (evt) {
          return this.search_results_mouseup(evt);
        }, this)
      );
      this.search_results.mouseover(
        __bind(function (evt) {
          return this.search_results_mouseover(evt);
        }, this)
      );
      this.search_results.mouseout(
        __bind(function (evt) {
          return this.search_results_mouseout(evt);
        }, this)
      );
      this.form_field_jq.bind(
        'liszt:updated',
        __bind(function (evt) {
          return this.results_update_field(evt);
        }, this)
      );
      this.search_field.blur(
        __bind(function (evt) {
          return this.input_blur(evt);
        }, this)
      );
      this.search_field.keyup(
        __bind(function (evt) {
          return this.keyup_checker(evt);
        }, this)
      );
      this.search_field.keydown(
        __bind(function (evt) {
          return this.keydown_checker(evt);
        }, this)
      );
      if (this.is_multiple) {
        this.search_choices.click(
          __bind(function (evt) {
            return this.choices_click(evt);
          }, this)
        );
        return this.search_field.focus(
          __bind(function (evt) {
            return this.input_focus(evt);
          }, this)
        );
      } else {
        return this.container.click(
          __bind(function (evt) {
            return evt.preventDefault();
          }, this)
        );
      }
    };
    Chosen.prototype.search_field_disabled = function () {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chzn-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind('focus', this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chzn-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind('focus', this.activate_action);
        }
      }
    };
    Chosen.prototype.container_mousedown = function (evt) {
      var target_closelink;
      if (!this.is_disabled) {
        target_closelink = evt != null ? $(evt.target).hasClass('search-choice-close') : false;
        if (evt && evt.type === 'mousedown') {
          evt.stopPropagation();
        }
        if (!this.pending_destroy_click && !target_closelink) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val('');
            }
            $(document).click(this.click_test_action);
            this.results_show();
          } else if (
            !this.is_multiple &&
            evt &&
            ($(evt.target)[0] === this.selected_item[0] ||
              $(evt.target).parents('a.chzn-single').length)
          ) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        } else {
          return (this.pending_destroy_click = false);
        }
      }
    };
    Chosen.prototype.container_mouseup = function (evt) {
      if (evt.target.nodeName === 'ABBR') {
        return this.results_reset(evt);
      }
    };
    Chosen.prototype.blur_test = function (evt) {
      if (!this.active_field && this.container.hasClass('chzn-container-active')) {
        return this.close_field();
      }
    };
    Chosen.prototype.close_field = function () {
      $(document).unbind('click', this.click_test_action);
      if (!this.is_multiple) {
        this.selected_item.attr('tabindex', this.search_field.attr('tabindex'));
        this.search_field.attr('tabindex', -1);
      }
      this.active_field = false;
      this.results_hide();
      this.container.removeClass('chzn-container-active');
      this.winnow_results_clear();
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };
    Chosen.prototype.activate_field = function () {
      if (!this.is_multiple && !this.active_field) {
        this.search_field.attr('tabindex', this.selected_item.attr('tabindex'));
        this.selected_item.attr('tabindex', -1);
      }
      this.container.addClass('chzn-container-active');
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };
    Chosen.prototype.test_active_click = function (evt) {
      if ($(evt.target).parents('#' + this.container_id).length) {
        return (this.active_field = true);
      } else {
        return this.close_field();
      }
    };
    Chosen.prototype.results_build = function () {
      var content, data, _i, _len, _ref;
      this.parsing = true;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple && this.choices > 0) {
        this.search_choices.find('li.search-choice').remove();
        this.choices = 0;
      } else if (!this.is_multiple) {
        this.selected_item.find('span').text(this.default_text);
        if (this.form_field.options.length <= this.disable_search_threshold) {
          this.container.addClass('chzn-container-single-nosearch');
        } else {
          this.container.removeClass('chzn-container-single-nosearch');
        }
      }
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.find('span').text(data.text);
            if (this.allow_single_deselect) {
              this.single_deselect_control_build();
            }
          }
        }
      }
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.html(content);
      return (this.parsing = false);
    };
    Chosen.prototype.result_add_group = function (group) {
      if (!group.disabled) {
        group.dom_id = this.container_id + '_g_' + group.array_index;
        return (
          '<li id="' +
          group.dom_id +
          '" class="group-result">' +
          $('<div />').text(group.label).html() +
          '</li>'
        );
      } else {
        return '';
      }
    };
    Chosen.prototype.result_do_highlight = function (el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass('highlighted');
        maxHeight = parseInt(this.search_results.css('maxHeight'), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop(
            high_bottom - maxHeight > 0 ? high_bottom - maxHeight : 0
          );
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };
    Chosen.prototype.result_clear_highlight = function () {
      if (this.result_highlight) {
        this.result_highlight.removeClass('highlighted');
      }
      return (this.result_highlight = null);
    };
    Chosen.prototype.results_show = function () {
      var dd_top;
      if (!this.is_multiple) {
        this.selected_item.addClass('chzn-single-with-drop');
        if (this.result_single_selected) {
          this.result_do_highlight(this.result_single_selected);
        }
      }
      dd_top = this.is_multiple ? this.container.height() : this.container.height() - 1;
      this.dropdown.css({
        top: dd_top + 'px',
        left: 0,
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };
    Chosen.prototype.results_hide = function () {
      if (!this.is_multiple) {
        this.selected_item.removeClass('chzn-single-with-drop');
      }
      this.result_clear_highlight();
      this.dropdown.css({
        left: '-9000px',
      });
      return (this.results_showing = false);
    };
    Chosen.prototype.set_tab_index = function (el) {
      var ti;
      if (this.form_field_jq.attr('tabindex')) {
        ti = this.form_field_jq.attr('tabindex');
        this.form_field_jq.attr('tabindex', -1);
        if (this.is_multiple) {
          return this.search_field.attr('tabindex', ti);
        } else {
          this.selected_item.attr('tabindex', ti);
          return this.search_field.attr('tabindex', -1);
        }
      }
    };
    Chosen.prototype.show_search_field_default = function () {
      if (this.is_multiple && this.choices < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass('default');
      } else {
        this.search_field.val('');
        return this.search_field.removeClass('default');
      }
    };
    Chosen.prototype.search_results_mouseup = function (evt) {
      var target;
      target = $(evt.target).hasClass('active-result')
        ? $(evt.target)
        : $(evt.target).parents('.active-result').first();
      if (target.length) {
        this.result_highlight = target;
        return this.result_select(evt);
      }
    };
    Chosen.prototype.search_results_mouseover = function (evt) {
      var target;
      target = $(evt.target).hasClass('active-result')
        ? $(evt.target)
        : $(evt.target).parents('.active-result').first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };
    Chosen.prototype.search_results_mouseout = function (evt) {
      if (
        $(evt.target).hasClass('active-result' || $(evt.target).parents('.active-result').first())
      ) {
        return this.result_clear_highlight();
      }
    };
    Chosen.prototype.choices_click = function (evt) {
      evt.preventDefault();
      if (
        this.active_field &&
        !$(evt.target).hasClass('search-choice' || $(evt.target).parents('.search-choice').first) &&
        !this.results_showing
      ) {
        return this.results_show();
      }
    };
    Chosen.prototype.choice_build = function (item) {
      var choice_id, link;
      choice_id = this.container_id + '_c_' + item.array_index;
      this.choices += 1;
      this.search_container.before(
        '<li class="search-choice" id="' +
          choice_id +
          '"><span>' +
          item.html +
          '</span><a href="javascript:void(0)" class="search-choice-close" rel="' +
          item.array_index +
          '"></a></li>'
      );
      link = $('#' + choice_id)
        .find('a')
        .first();
      return link.click(
        __bind(function (evt) {
          return this.choice_destroy_link_click(evt);
        }, this)
      );
    };
    Chosen.prototype.choice_destroy_link_click = function (evt) {
      evt.preventDefault();
      if (!this.is_disabled) {
        this.pending_destroy_click = true;
        return this.choice_destroy($(evt.target));
      } else {
        return evt.stopPropagation;
      }
    };
    Chosen.prototype.choice_destroy = function (link) {
      this.choices -= 1;
      this.show_search_field_default();
      if (this.is_multiple && this.choices > 0 && this.search_field.val().length < 1) {
        this.results_hide();
      }
      this.result_deselect(link.attr('rel'));
      return link.parents('li').first().remove();
    };
    Chosen.prototype.results_reset = function (evt) {
      this.form_field.options[0].selected = true;
      this.selected_item.find('span').text(this.default_text);
      this.show_search_field_default();
      $(evt.target).remove();
      this.form_field_jq.trigger('change');
      if (this.active_field) {
        return this.results_hide();
      }
    };
    Chosen.prototype.result_select = function (evt) {
      var high, high_id, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        high_id = high.attr('id');
        this.result_clear_highlight();
        if (this.is_multiple) {
          this.result_deactivate(high);
        } else {
          this.search_results.find('.result-selected').removeClass('result-selected');
          this.result_single_selected = high;
        }
        high.addClass('result-selected');
        position = high_id.substr(high_id.lastIndexOf('_') + 1);
        item = this.results_data[position];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.find('span').first().text(item.text);
          if (this.allow_single_deselect) {
            this.single_deselect_control_build();
          }
        }
        if (!(evt.metaKey && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val('');
        this.form_field_jq.trigger('change');
        return this.search_field_scale();
      }
    };
    Chosen.prototype.result_activate = function (el) {
      return el.addClass('active-result');
    };
    Chosen.prototype.result_deactivate = function (el) {
      return el.removeClass('active-result');
    };
    Chosen.prototype.result_deselect = function (pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      result_data.selected = false;
      this.form_field.options[result_data.options_index].selected = false;
      result = $('#' + this.container_id + '_o_' + pos);
      result.removeClass('result-selected').addClass('active-result').show();
      this.result_clear_highlight();
      this.winnow_results();
      this.form_field_jq.trigger('change');
      return this.search_field_scale();
    };
    Chosen.prototype.single_deselect_control_build = function () {
      if (this.allow_single_deselect && this.selected_item.find('abbr').length < 1) {
        return this.selected_item
          .find('span')
          .first()
          .after('<abbr class="search-choice-close"></abbr>');
      }
    };
    Chosen.prototype.winnow_results = function () {
      var found,
        option,
        part,
        parts,
        regex,
        result,
        result_id,
        results,
        searchText,
        startpos,
        text,
        zregex,
        _i,
        _j,
        _len,
        _len2,
        _ref;
      this.no_results_clear();
      results = 0;
      searchText =
        this.search_field.val() === this.default_text
          ? ''
          : $('<div/>').text($.trim(this.search_field.val())).html();
      regex = new RegExp('^' + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (!option.disabled && !option.empty) {
          if (option.group) {
            $('#' + option.dom_id).css('display', 'none');
          } else if (!(this.is_multiple && option.selected)) {
            found = false;
            result_id = option.dom_id;
            result = $('#' + result_id);
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (option.html.indexOf(' ') >= 0 || option.html.indexOf('[') === 0) {
              parts = option.html.replace(/\[|\]/g, '').split(' ');
              if (parts.length) {
                for (_j = 0, _len2 = parts.length; _j < _len2; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(zregex);
                text =
                  option.html.substr(0, startpos + searchText.length) +
                  '</em>' +
                  option.html.substr(startpos + searchText.length);
                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              } else {
                text = option.html;
              }
              result.html(text);
              this.result_activate(result);
              if (option.group_array_index != null) {
                $('#' + this.results_data[option.group_array_index].dom_id).css(
                  'display',
                  'list-item'
                );
              }
            } else {
              if (this.result_highlight && result_id === this.result_highlight.attr('id')) {
                this.result_clear_highlight();
              }
              this.result_deactivate(result);
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        return this.no_results(searchText);
      } else {
        return this.winnow_results_set_highlight();
      }
    };
    Chosen.prototype.winnow_results_clear = function () {
      var li, lis, _i, _len, _results;
      this.search_field.val('');
      lis = this.search_results.find('li');
      _results = [];
      for (_i = 0, _len = lis.length; _i < _len; _i++) {
        li = lis[_i];
        li = $(li);
        _results.push(
          li.hasClass('group-result')
            ? li.css('display', 'auto')
            : !this.is_multiple || !li.hasClass('result-selected')
              ? this.result_activate(li)
              : void 0
        );
      }
      return _results;
    };
    Chosen.prototype.winnow_results_set_highlight = function () {
      var do_high, selected_results;
      if (!this.result_highlight) {
        selected_results = !this.is_multiple
          ? this.search_results.find('.result-selected.active-result')
          : [];
        do_high = selected_results.length
          ? selected_results.first()
          : this.search_results.find('.active-result').first();
        if (do_high != null) {
          return this.result_do_highlight(do_high);
        }
      }
    };
    Chosen.prototype.no_results = function (terms) {
      var no_results_html;
      no_results_html = $(
        '<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>'
      );
      no_results_html.find('span').first().html(terms);
      return this.search_results.append(no_results_html);
    };
    Chosen.prototype.no_results_clear = function () {
      return this.search_results.find('.no-results').remove();
    };
    Chosen.prototype.keydown_arrow = function () {
      var first_active, next_sib;
      if (!this.result_highlight) {
        first_active = this.search_results.find('li.active-result').first();
        if (first_active) {
          this.result_do_highlight($(first_active));
        }
      } else if (this.results_showing) {
        next_sib = this.result_highlight.nextAll('li.active-result').first();
        if (next_sib) {
          this.result_do_highlight(next_sib);
        }
      }
      if (!this.results_showing) {
        return this.results_show();
      }
    };
    Chosen.prototype.keyup_arrow = function () {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll('li.active-result');
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };
    Chosen.prototype.keydown_backstroke = function () {
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find('a').first());
        return this.clear_backstroke();
      } else {
        this.pending_backstroke = this.search_container.siblings('li.search-choice').last();
        return this.pending_backstroke.addClass('search-choice-focus');
      }
    };
    Chosen.prototype.clear_backstroke = function () {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass('search-choice-focus');
      }
      return (this.pending_backstroke = null);
    };
    Chosen.prototype.keydown_checker = function (evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          this.keydown_arrow();
          break;
      }
    };
    Chosen.prototype.search_field_scale = function () {
      var dd_top, div, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = 'position:absolute; left: -1000px; top: -1000px; display:none;';
        styles = [
          'font-size',
          'font-style',
          'font-weight',
          'font-family',
          'line-height',
          'text-transform',
          'letter-spacing',
        ];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ':' + this.search_field.css(style) + ';';
        }
        div = $('<div />', {
          style: style_block,
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        if (w > this.f_width - 10) {
          w = this.f_width - 10;
        }
        this.search_field.css({
          width: w + 'px',
        });
        dd_top = this.container.height();
        return this.dropdown.css({
          top: dd_top + 'px',
        });
      }
    };
    Chosen.prototype.generate_random_id = function () {
      var string;
      string =
        'sel' +
        this.generate_random_char() +
        this.generate_random_char() +
        this.generate_random_char();
      while ($('#' + string).length > 0) {
        string += this.generate_random_char();
      }
      return string;
    };
    return Chosen;
  })();
  get_side_border_padding = function (elmt) {
    var side_border_padding;
    return (side_border_padding = elmt.outerWidth() - elmt.width());
  };
  root.get_side_border_padding = get_side_border_padding;
}).call(this);
