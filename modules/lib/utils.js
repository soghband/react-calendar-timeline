'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._get = _get;
exports._length = _length;
exports.arraysEqual = arraysEqual;
exports.iterateTimes = iterateTimes;
exports.getMinUnit = getMinUnit;
exports.getNextUnit = getNextUnit;
exports.getParentPosition = getParentPosition;
exports.coordinateToTimeRatio = coordinateToTimeRatio;
exports.calculateDimensions = calculateDimensions;
exports.getGroupOrders = getGroupOrders;
exports.getVisibleItems = getVisibleItems;
exports.collision = collision;
exports.stack = stack;
exports.nostack = nostack;
exports.hasSomeParentTheClass = hasSomeParentTheClass;
exports.createGradientPattern = createGradientPattern;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EPSILON = 0.001;

// so we could use both immutable.js objects and regular objects
function _get(object, key) {
  return typeof object.get === 'function' ? object.get(key) : object[key];
}

function _length(object) {
  return typeof object.count === 'function' ? object.count() : object.length;
}

function arraysEqual(array1, array2) {
  return _length(array1) === _length(array2) && array1.every(function (element, index) {
    return element === _get(array2, index);
  });
}

function iterateTimes(start, end, unit, callback) {
  var time = (0, _moment2.default)(start).startOf(unit);

  while (time.valueOf() < end) {
    var nextTime = (0, _moment2.default)(time).add(1, unit + 's');
    callback(time, nextTime);
    time = nextTime;
  }
}

function getMinUnit(zoom, width) {
  var timeDividers = {
    second: 1000,
    minute: 60,
    hour: 60,
    day: 24,
    month: 30,
    year: 12
  };

  var minUnit = 'year';
  var breakCount = zoom;
  var minCellWidth = 17;

  Object.keys(timeDividers).some(function (unit) {
    breakCount = breakCount / timeDividers[unit];
    if (breakCount < width / minCellWidth) {
      minUnit = unit;
      return true;
    }
  });

  return minUnit;
}

function getNextUnit(unit) {
  var nextUnits = {
    second: 'minute',
    minute: 'hour',
    hour: 'day',
    day: 'month',
    month: 'year'
  };

  return nextUnits[unit] || '';
}

function getParentPosition(element) {
  var xPosition = 0;
  var yPosition = 0;
  var first = true;

  while (element) {
    xPosition += element.offsetLeft - (first ? 0 : element.scrollLeft) + element.clientLeft;
    yPosition += element.offsetTop - (first ? 0 : element.scrollTop) + element.clientTop;
    element = element.offsetParent;
    first = false;
  }
  return { x: xPosition, y: yPosition };
}

function coordinateToTimeRatio(canvasTimeStart, canvasTimeEnd, canvasWidth) {
  return (canvasTimeEnd - canvasTimeStart) / canvasWidth;
}

function calculateDimensions(item, order, keys, canvasTimeStart, canvasTimeEnd, canvasWidth, dragSnap, lineHeight, draggingItem, dragTime, resizingItem, resizeEnd, newGroupOrder) {
  var itemId = _get(item, keys.itemIdKey);
  var itemTimeStart = _get(item, keys.itemTimeStartKey);
  var itemTimeEnd = _get(item, keys.itemTimeEndKey);

  var isDragging = itemId == draggingItem;
  var isResizing = itemId == resizingItem;

  var x = isDragging ? dragTime : itemTimeStart;

  var w = Math.max((isResizing ? resizeEnd : itemTimeEnd) - itemTimeStart, dragSnap);
  var h = lineHeight * 0.65;
  var ratio = 1 / coordinateToTimeRatio(canvasTimeStart, canvasTimeEnd, canvasWidth);

  var dimensions = {
    left: (x - canvasTimeStart) * ratio,
    top: null,
    width: Math.max(w * ratio, 3),
    height: h,
    order: isDragging ? newGroupOrder : order,
    stack: true,
    lineHeight: lineHeight
  };

  return dimensions;
}

function getGroupOrders(groups, keys) {
  var groupIdKey = keys.groupIdKey;

  var groupOrders = {};

  for (var i = 0; i < groups.length; i++) {
    groupOrders[_get(groups[i], groupIdKey)] = i;
  }

  return groupOrders;
}

function getVisibleItems(items, canvasTimeStart, canvasTimeEnd, keys) {
  var itemTimeStartKey = keys.itemTimeStartKey;
  var itemTimeEndKey = keys.itemTimeEndKey;

  return items.filter(function (item) {
    return _get(item, itemTimeStartKey) <= canvasTimeEnd && _get(item, itemTimeEndKey) >= canvasTimeStart;
  });
}

function collision(a, b, lineHeight) {
  var verticalMargin = (lineHeight - a.height) / 2;
  return a.left + EPSILON < b.left + b.width && a.left + a.width - EPSILON > b.left && a.top - verticalMargin + EPSILON < b.top + b.height && a.top + a.height + verticalMargin - EPSILON > b.top;
}

function stack(items, groupOrders, lineHeight, headerHeight, force) {
  var i, iMax;

  var totalHeight = headerHeight;

  var groupHeights = {};
  var groupTops = {};

  var groupedItems = (0, _lodash.groupBy)(items, function (item) {
    return item.dimensions.order;
  });

  if (force) {
    // reset top position of all items
    for (i = 0, iMax = items.length; i < iMax; i++) {
      items[i].dimensions.top = null;
    }
  }

  (0, _lodash.forEach)(groupOrders, function (key, url) {
    // calculate new, non-overlapping positions
    var group = groupedItems[key] || [];

    groupTops[key] = totalHeight;

    var groupHeight = 0;
    for (i = 0, iMax = group.length; i < iMax; i++) {
      var item = group[i];
      var verticalMargin = (item.dimensions.lineHeight - item.dimensions.height) / 2;

      if (item.dimensions.stack && item.dimensions.top === null) {
        item.dimensions.top = totalHeight + verticalMargin;
        groupHeight = Math.max(groupHeight, item.dimensions.lineHeight);
        do {
          var collidingItem = null;
          for (var j = 0, jj = group.length; j < jj; j++) {
            var other = group[j];
            if (other.top !== null && other !== item && other.dimensions.stack && collision(item.dimensions, other.dimensions, item.dimensions.lineHeight)) {
              collidingItem = other;
              break;
            } else {
              //console.log('dont test', other.top !== null, other !== item, other.stack);
            }
          }

          if (collidingItem != null) {
            // There is a collision. Reposition the items above the colliding element
            item.dimensions.top = collidingItem.dimensions.top + collidingItem.dimensions.lineHeight + verticalMargin;
            groupHeight = Math.max(groupHeight, item.dimensions.top + item.dimensions.height + verticalMargin - totalHeight);
          }
        } while (collidingItem);
      }
    }
    groupHeights[key] = Math.max(groupHeight, lineHeight);
    totalHeight += Math.max(groupHeight, lineHeight);
  });
  return {
    height: totalHeight,
    groupHeights: groupHeights,
    groupTops: groupTops
  };
}

function nostack(items, groupOrders, lineHeight, headerHeight, force) {
  var i, iMax;

  var totalHeight = headerHeight;

  var groupHeights = {};
  var groupTops = {};

  var groupedItems = (0, _lodash.groupBy)(items, function (item) {
    return item.dimensions.order;
  });

  if (force) {
    // reset top position of all items
    for (i = 0, iMax = items.length; i < iMax; i++) {
      items[i].dimensions.top = null;
    }
  }

  (0, _lodash.forEach)(groupOrders, function (key, url) {
    // calculate new, non-overlapping positions
    var group = groupedItems[key] || [];

    groupTops[key] = totalHeight;

    var groupHeight = 0;
    for (i = 0, iMax = group.length; i < iMax; i++) {
      var item = group[i];
      var verticalMargin = (item.dimensions.lineHeight - item.dimensions.height) / 2;

      if (item.dimensions.top === null) {
        item.dimensions.top = totalHeight + verticalMargin;
        groupHeight = Math.max(groupHeight, item.dimensions.lineHeight);
      }
    }
    groupHeights[key] = Math.max(groupHeight, lineHeight);
    totalHeight += Math.max(groupHeight, lineHeight);
  });
  return {
    height: totalHeight,
    groupHeights: groupHeights,
    groupTops: groupTops
  };
}

function hasSomeParentTheClass(element, classname) {
  if (element.className && element.className.split(' ').indexOf(classname) >= 0) return true;
  return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
}

function createGradientPattern(lineHeight, color1, color2, borderColor) {
  if (borderColor) {
    if (!color2 || color1 === color2) {
      return 'repeating-linear-gradient(to bottom, ' + (color1 + ',') + (color1 + ' ' + (lineHeight - 1) + 'px,') + (borderColor + ' ' + (lineHeight - 1) + 'px,') + (borderColor + ' ' + lineHeight + 'px') + ')';
    } else {
      return 'repeating-linear-gradient(to bottom, ' + (color1 + ',') + (color1 + ' ' + (lineHeight - 1) + 'px,') + (borderColor + ' ' + (lineHeight - 1) + 'px,') + (borderColor + ' ' + lineHeight + 'px,') + (color2 + ' ' + lineHeight + 'px,') + (color2 + ' ' + (lineHeight * 2 - 1) + 'px,') + (borderColor + ' ' + (lineHeight * 2 - 1) + 'px,') + (borderColor + ' ' + lineHeight * 2 + 'px') + ')';
    }
  } else {
    if (!color2 || color1 === color2) {
      return color1;
    } else {
      return 'repeating-linear-gradient(to bottom,' + color1 + ',' + color1 + ' ' + lineHeight + 'px,' + color2 + ' ' + lineHeight + 'px,' + color2 + ' ' + lineHeight * 2 + 'px)';
    }
  }
}