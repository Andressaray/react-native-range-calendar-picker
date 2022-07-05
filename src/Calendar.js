import React from 'react'
import {Text} from 'react-native'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import Month from './Month'

import { styles } from './Style'
import { StaticWeekdays } from './Weekdays'
import moment from 'moment'

export default class Calendar extends React.Component {
  static defaultProps = {
    startDate: new Date(),
    selectFrom: new Date(),
    today: new Date(),
    selectTo: null,
    monthsCount: 4,
    rangeDays: 5,
    renderRightIcon: () => <Text>{'>'}</Text>,
    disabled: false,
    type: 'gregorian',
    onSelectionChange: null,
    monthNameChangeThreshold: 60,
    onPassLimit: () => {},
    monthsLocale: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    weekDaysLocale: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
    showSeparator: false,
    separatorColor: '#eee',
    separatorHeight: 1,
    width: Dimensions.get('window').width,
    monthNameMode: 'both',
    weekdaysNameMode: 'static',
    bodyBackColor: '#fff',
    bodyTextColor: '#444',
    weak: {
      textStyle: {
        color: '#222',
      },
    },
    month: {
      header: {
        monthHeader: null,
      },
    },
    day: {
      commonTextColor: '#444',
      disabledTextColor: '#ccc',
      selectedBackColor: '#444',
      selectedTextColor: '#fff',
      selectedBorderRadius: 25,
      todayBorderColor: '#444',
      todayTextColor: '#444',
      todayBorderRadius: 25,
      todayBorderWidth: 0.5,
      inRangeBackColor: '#ddd',
      inRangeTextColor: '#444',
      textStyle: {
        color: '#000',
      },
      disabledTextStyle: {
        color: '#09f',
      },
      disabledStyle: {},
      selectStartRangeStyle: {
        borderRadius: 20,
      },
      selectEndRangeStyle: {
        borderRadius: 20,
      },
      inRangeStyle: {
        backgroundColor: '#423',
      },
      inRangeTextStyle: {
        color: '#000953',
      },
      selectTodayTextStyle: {
        backgroundColor: '#333',
      },
      selectTodayStyle: {
        color: '#333',
      },
      selectStartRangeTextStyle: {
        color: '#fff',
      },
      inRangeStyle: {},
      inRangeTextStyle: {},
    },
    moment: null,
    rangeSelect: false,
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    selectFrom: PropTypes.instanceOf(Date),
    selectTo: PropTypes.instanceOf(Date),
    moment: PropTypes.func,
    monthsCount: PropTypes.number,
    startDate: PropTypes.instanceOf(Date),
    monthNameChangeThreshold: PropTypes.number,
    rangeDays: PropTypes.number.isRequired,
    monthsLocale: PropTypes.arrayOf(PropTypes.string),
    weekDaysLocale: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    onSelectionChange: PropTypes.func,
    showSeparator: PropTypes.bool,
    separatorColor: PropTypes.string,
    separatorHeight: PropTypes.number,
    renderRightIcon: PropTypes.elementType,
    width: PropTypes.number,
    monthNameMode: PropTypes.string, // Can be 'simple' , 'static' , 'both'
    weekdaysNameMode: PropTypes.string, // Can be 'simple' , 'static' , 'both'
    bodyBackColor: PropTypes.string,
    bodyTextColor: PropTypes.string,
    staticMonthBackColor: PropTypes.string,
    staticMonthTextColor: PropTypes.string,
    staticWeekdaysBackColor: PropTypes.string,
    staticWeekdaysTextColor: PropTypes.string,
    monthTextColor: PropTypes.string,
    weak: PropTypes.shape({
      textStyle: PropTypes.instanceOf(TextStyle),
    }),
    month: PropTypes.shape({
      header: PropTypes.shape({
        headerStyle: PropTypes.object,
        headerTextStyle: PropTypes.object,
        weekdaysStyle: PropTypes.object,
        weekdaysItemStyle: PropTypes.object,
        weekdaysTextStyle: PropTypes.object,
        monthHeader: PropTypes.func,
      }),
      style: PropTypes.shape({
        backgroundColor: PropTypes.string,
      }),
    }),
    day: PropTypes.shape({
      commonBackColor: PropTypes.string,
      commonTextColor: PropTypes.string,
      disabledBackColor: PropTypes.string,
      disabledTextColor: PropTypes.string,
      selectedBackColor: PropTypes.string,
      selectedTextColor: PropTypes.string,
      selectedBorderRadius: PropTypes.number,
      selectTodayTextStyle: PropTypes.instanceOf(TextStyle),
      selectTodayStyle: PropTypes.instanceOf(ViewStyle),
      todayBorderColor: PropTypes.string,
      todayTextColor: PropTypes.string,
      todayBorderRadius: PropTypes.number,
      todayBorderWidth: PropTypes.number,
      inRangeBackColor: PropTypes.string,
      inRangeTextColor: PropTypes.string,
      onPassLimit: PropTypes.func,
      disabledTextStyle: PropTypes.instanceOf(TextStyle),
      disabledStyle: PropTypes.instanceOf(ViewStyle),
      selectStartRangeStyle: PropTypes.instanceOf(ViewStyle),
      selectEndRangeStyle: PropTypes.instanceOf(ViewStyle),
      inRangeStyle: PropTypes.instanceOf(ViewStyle),
      inRangeTextStyle: PropTypes.instanceOf(TextStyle),
      selectStartRangeTextStyle: PropTypes.instanceOf(TextStyle),
      textStyle: PropTypes.instanceOf(TextStyle),
      dayComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    }),
    rangeSelect: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    let {
      selectFrom,
      selectTo,
      monthsCount,
      startDate,
      rangeSelect,
      type,
      monthsLocale,
      moment,
    } = props
    if (rangeSelect) {
      this.selectFrom = selectFrom
      this.selectTo = selectTo !== selectFrom ? selectTo : null
    } else {
      this.selectFrom = this.selectTo = selectFrom
    }
    this.momentPrefix = ''
    if (type === 'jalali') {
      this.momentPrefix = 'j'
    } else if (type === 'hijri') {
      this.momentPrefix = 'i'
    }
    this.months = this.generateMonths(monthsCount, startDate)
    this.viewabilityConfig = {
      viewAreaCoveragePercentThreshold: 0,
    }

    this.scrollItem = 0
    let currentMonth = this.momentPrefix
      ? moment(startDate).format(`${this.momentPrefix}MMMM`)
      : monthsLocale[startDate.getMonth()]
    // Find scroll Index and Scrolled month name
    this.months.map((month, index) => {
      const getMonth = `${this.momentPrefix || 'get'}Month`
      const startingMonth = this.momentPrefix
        ? moment(month[7].date)[getMonth]() ===
          moment(this.selectFrom)[getMonth]()
        : month[7].date[getMonth]() === this.selectFrom[getMonth]()
      if (startingMonth) {
        this.scrollItem = index
        if (this.momentPrefix) {
          currentMonth = moment(month[7].date).format(
            `${this.momentPrefix}MMMM ${this.momentPrefix}YYYY`
          )
          currentMonthMoment = moment(month[7].date).format(
            `${this.momentPrefix}MMMM ${this.momentPrefix}YYYY`
          )
        } else {
          currentMonth = monthsLocale[month[7].date.getMonth()]
          let date = moment().month(currentMonth).format('MMMM').toUpperCase()
        }
      }
    })
    this.scrollRef = React.createRef()
    this.state = {
      dataSource: this.months,
      currentMonth,
    }
  }

  handleNextMonth = () => {
    let value = 370
    value = 370 * this.scrollItem
    this.scrollItem = this.scrollItem + 1
    if (!this.scrollItem) {
      this.scrollItem = 1
      value = 370
    }
    if (this.scrollItem - 1 == this.props.monthsCount) {
      this.scrollItem = 1
      value = 0
    }
    this.scrollRef.current?.scrollToOffset({ offset: value, animated: true })
  }

  generateMonths = (count, startDate) => {
    let months = []
    let monthIterator = new Date(startDate)
    for (let i = 0; i < count; i++) {
      let month = this.getDates(monthIterator)
      if (month) {
        months.push(
          month.map((day) => {
            return day
              ? {
                  date: day,
                  status: this.getStatus(day, this.selectFrom, this.selectTo),
                  disabled:
                    day.getTime() <
                    new Date(startDate).setDate(startDate.getDate() - 1),
                }
              : { date: '', status: 'monthFirstDays' }
          })
        )
      } else {
        count++
      }
      monthIterator.setMonth(monthIterator.getMonth() + 1)
    }
    return months
  }

  getDates = (date) => {
    const { type, startDate, moment } = this.props
    let month = new Date(date.setDate(1))
    let momentStart = ''
    let momentEnd = ''
    if (this.momentPrefix) {
      momentStart = moment(month).startOf(`${this.momentPrefix}Month`)
      momentEnd = moment(month).endOf(`${this.momentPrefix}Month`)
    }
    let monthStart = this.momentPrefix
      ? momentStart.toDate()
      : new Date(month.getFullYear(), month.getMonth(), 1)
    let monthEnd = this.momentPrefix
      ? momentEnd.toDate()
      : new Date(month.getFullYear(), month.getMonth() + 1, 0)
    if (startDate < monthEnd) {
      let renderDate = new Date(monthStart)
      let allDates = []
      while (renderDate <= monthEnd) {
        // Make empty objects to handle month first day exact weekday
        if (
          renderDate.getDate() === monthStart.getDate() &&
          allDates.length === 0
        ) {
          let weekDay =
            type === 'gregorian' ? renderDate.getDay() : renderDate.getDay() + 1
          if (weekDay < 7) {
            const delta = new Array(weekDay).fill(null)
            allDates.push(...delta)
          }
        }
        allDates.push(new Date(renderDate))
        renderDate.setDate(renderDate.getDate() + 1)
      }
      return allDates
    }
  }

  changeSelection = (date) => {
    if (this.props.disabled) return
    let { selectFrom, selectTo, months } = this
    const { rangeSelect } = this.props
    if (!selectFrom) {
      selectFrom = date
    } else if (!selectTo) {
      if (date > selectFrom) {
        selectTo = date
      } else {
        selectFrom = date
      }
    } else if (selectFrom && selectTo) {
      selectFrom = date
      selectTo = null
    }
    selectFrom = this.props.selectFrom
    let result = moment(selectTo).diff(moment(), 'd')
    const newDate = new Date()
    if (result) {
      if (result > this.props.rangeDays) {
        newDate.setDate(newDate.getDate() + this.props.rangeDays)
        selectTo = newDate
        this.props.onPassLimit(result)
      }
    }
    months = months.map((month) => {
      return month.map((day) => {
        return day.date
          ? {
              date: day.date,
              status: this.getStatus(day.date, selectFrom, selectTo),
              disabled: day.disabled,
            }
          : { date: '', status: 'monthFirstDays' }
      })
    })
    if (rangeSelect) {
      this.selectFrom = new Date()
      this.selectTo = selectTo
    } else {
      this.selectFrom = this.selectTo = new Date()
    }

    this.months = months

    let dates = {}
    if (rangeSelect && this.selectFrom && this.selectTo)
      dates = {
        from: new Date(),
        to: this.selectTo,
        count: Math.floor(
          (this.selectTo - new Date()) / (1000 * 24 * 60 * 60) + 1
        ),
      }
    else dates = { from: new Date(), to: this.selectFrom, count: 0 }

    this.props.onSelectionChange({
      type: rangeSelect ? 'range' : 'single',
      ...dates,
    })
    this.prevValue = date
    this.setState({
      dataSource: months,
    })
  }
  getStatus = (date, selectFrom, selectTo) => {
    if ((selectFrom && !selectTo) || selectFrom === selectTo)
      if (selectFrom.toDateString() === date.toDateString()) {
        return 'singleDate'
      }
    if (date.toDateString() === this.props.today?.toDateString()) {
      return 'today'
    }
    if (selectFrom)
      if (selectFrom.toDateString() === date.toDateString()) {
        return 'firstDay'
      }
    if (selectTo)
      if (selectTo?.toDateString() === date.toDateString()) {
        return 'lastDay'
      }
    if (selectFrom && selectTo)
      if (selectFrom < date && date < selectTo) {
        return 'inRange'
      }
    return 'common'
  }

  _keyExtractor = (item, index) => 'month' + index

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (this.momentPrefix)
      this.setState({
        currentMonth:
          viewableItems[0] &&
          this.props
            .moment(viewableItems[0].item[7].date)
            .format(`${this.momentPrefix}MMMM ${this.momentPrefix}YYYY`),
      })
    else
      this.setState({
        currentMonth:
          viewableItems[0] &&
          `${
            this.props.monthsLocale[viewableItems[0].item[7].date.getMonth()]
          } ${viewableItems[0].item[7].date.getFullYear()}`,
      })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: this.props.separatorHeight,
          width: '100%',
          backgroundColor: this.props.separatorColor,
          alignItems: 'center',
        }}
      />
    )
  }

  render() {
    let {
      style,
      width,
      monthNameMode,
      weekdaysNameMode,
      monthNameChangeThreshold,
      showSeparator,
      staticMonthBackColor,
      staticMonthTextColor,
    } = this.props
    return (
      <View>
        <View
          style={{
            borderBottomWidth: 0,
            color: '#eee',
            marginTop: 20,
          }}
        >
          {(monthNameMode === 'static' || monthNameMode === 'both') && (
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginHorizontal: 10,
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  {
                    textAlign: 'center',
                    fontSize: 18,
                    marginLeft: 10,
                    color: '#A22380',
                    fontFamily: 'Montserrat-Medium',
                  },
                  staticMonthBackColor && {
                    backgroundColor: staticMonthBackColor,
                  },
                  staticMonthTextColor && { color: staticMonthTextColor },
                ]}
                bold
              >
                {this.state.currentMonth}
              </Text>
              <TouchableOpacity onPress={this.handleNextMonth}>
                {this.props.renderRightIcon}
              </TouchableOpacity>
            </View>
          )}
          {(weekdaysNameMode === 'static' || weekdaysNameMode === 'both') && (
            <StaticWeekdays {...this.props} />
          )}
        </View>
        <FlatList
          ref={this.scrollRef}
          initialListSize={3}
          style={[styles.listViewContainer, style]}
          removeClippedSubviews={true}
          keyExtractor={this._keyExtractor}
          data={this.state.dataSource}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
          initialScrollIndex={this.scrollItem}
          ItemSeparatorComponent={showSeparator && this.renderSeparator}
          getItemLayout={(data, index) => ({
            length: width - monthNameChangeThreshold,
            offset: (width - monthNameChangeThreshold) * index,
            index,
          })}
          renderItem={(month) => {
            return (
              <Month
                {...this.props}
                days={month.item}
                style={styles.month}
                changeSelection={this.changeSelection}
              />
            )
          }}
        />
      </View>
    )
  }
}
