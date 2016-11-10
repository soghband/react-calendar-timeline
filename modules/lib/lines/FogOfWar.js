"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xmityaz on 10.07.16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var FogOfWar = function (_Component) {
  _inherits(FogOfWar, _Component);

  function FogOfWar() {
    _classCallCheck(this, FogOfWar);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FogOfWar).apply(this, arguments));
  }

  _createClass(FogOfWar, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return !(nextProps.canvasTimeStart === this.props.canvasTimeStart && nextProps.canvasTimeEnd === this.props.canvasTimeEnd && nextProps.canvasWidth === this.props.canvasWidth && nextProps.height === this.props.height && nextProps.headerHeight === this.props.headerHeight && nextProps.fogTimeFrom === this.props.fogTimeFrom && nextProps.fogTimeTo === this.props.fogTimeTo);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props;
      var canvasTimeStart = _props.canvasTimeStart;
      var canvasTimeEnd = _props.canvasTimeEnd;
      var canvasWidth = _props.canvasWidth;
      var height = _props.height;
      var headerHeight = _props.headerHeight;
      var fogTimeFrom = _props.fogTimeFrom;
      var fogTimeTo = _props.fogTimeTo;

      var ratio = canvasWidth / (canvasTimeEnd - canvasTimeStart);
      var fogTimeFromLeft = Math.round((fogTimeFrom - canvasTimeStart) * ratio, -2);
      var fogTimeToRight = Math.round((canvasTimeEnd - fogTimeTo) * ratio, -2);
      var style = {
        top: headerHeight + "px",
        height: height - headerHeight + "px"
      };

      var fogFromStyle = _extends({}, style, {
        left: fogTimeFromLeft + "px",
        right: 0
      });
      var fogToStyle = _extends({}, style, {
        right: fogTimeToRight + "px",
        left: 0
      });

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement("div", { className: "rtc-fog", style: fogToStyle }),
        _react2.default.createElement("div", { className: "rtc-fog", style: fogFromStyle })
      );
    }
  }]);

  return FogOfWar;
}(_react.Component);

FogOfWar.propTypes = {
  canvasTimeStart: _react.PropTypes.number.isRequired,
  canvasTimeEnd: _react.PropTypes.number.isRequired,
  canvasWidth: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  headerHeight: _react.PropTypes.number.isRequired,
  fogTimeFrom: _react.PropTypes.number,
  fogTimeTo: _react.PropTypes.number
};

exports.default = FogOfWar;