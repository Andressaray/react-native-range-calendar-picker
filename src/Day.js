import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { styles } from './Style'

export default class Day extends React.PureComponent {
  render() {
    let {
      date,
      status,
      disabled,
      onDayPress,
      width,
      moment,
      day,
      type,
    } = this.props
    let momentPrefix = ''
    if (type === 'jalali') momentPrefix = 'j'
    else if (type === 'hijri') momentPrefix = 'i'
    if (day.dayComponent) {
      return (
        <View style={{ width: width / 7, height: width / 7 }}>
          {day.dayComponent(date, status, disabled, onDayPress)}
        </View>
      )
    }
    let onPress, textColor, backColor
    let containerStyle = {}
    let textStyle = {}
    let circleStyle = null
    let circleOutlineStyle = null
    if (disabled) {
      status = 'disabled'
      onPress = null
    } else {
      onPress = () => {
        onDayPress(date)
      }
    }
    if (
      date &&
      date.toDateString() === new Date().toDateString() &&
      status === 'common'
    ) {
      circleOutlineStyle = {
        backgroundColor: day.todayBackColor,
        width: '100%',
        height: '100%',
        borderColor: day.todayBorderColor,
        borderWidth: day.todayBorderWidth,
        alignItems: 'center',
        justifyContent: 'center',
      }
    }
    if (
      status === 'firstDay' ||
      status === 'lastDay' ||
      status === 'singleDate'
    ) {
      let styles =
        status === 'lastDay'
          ? day.selectEndRangeStyle
          : day.selectStartRangeStyle
      circleStyle = {
        backgroundColor: day.selectedBackColor,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        ...styles,
      }
    }

    switch (status) {
      case 'disabled':
        textStyle = day.disabledTextStyle
        containerStyle = day.disabledStyle

        break

      case 'common':
        textStyle = day.textStyle
        containerStyle = { backgroundColor: day.commonBackColor }
        break

      case 'firstDay':
        textStyle = day.selectStartRangeTextStyle
        containerStyle = day.selectStartRangeStyle

        break

      case 'today':
        textStyle = day.selectTodayTextStyle
        containerStyle = day.selectTodayStyle
        break

      case 'lastDay':
        textStyle = day.selectEndRangeTextStyle
        containerStyle = day.selectEndRangeTextStyle
        break

      case 'inRange':
        textStyle = day.inRangeTextStyle
        containerStyle = day.inRangeStyle
        break

      case 'singleDate':
        textStyle = { color: day.selectedTextColor }
        containerStyle = { backgroundColor: day.commonBackColor }
        break
    }
    if (date) {
      return (
        <TouchableOpacity
          activeOpacity={disabled ? 1 : 0.5}
          onPress={onPress}
          style={[
            styles.common,
            { width: width / 7, height: width / 7 },
            { ...containerStyle },
          ]}
        >
          {/* [{color: circleOutlineStyle ? day.todayTextColor : textColor} , {...day.textStyle}] */}
          {circleStyle || circleOutlineStyle ? (
            <View style={circleStyle ? circleStyle : circleOutlineStyle}>
              <Text style={{ ...textStyle, color: day.todayTextColor }}>
                {momentPrefix
                  ? moment(date).format(`${momentPrefix}D`)
                  : date.getDate()}
              </Text>
            </View>
          ) : (
            <Text style={textStyle}>
              {momentPrefix
                ? moment(date).format(`${momentPrefix}D`)
                : date.getDate()}
            </Text>
          )}
        </TouchableOpacity>
      )
    } else {
      return (
        <View
          style={[
            styles.common,
            {
              backgroundColor: day.commonBackColor,
              width: width / 7,
              height: width / 7,
            },
          ]}
        />
      )
    }
  }
}
