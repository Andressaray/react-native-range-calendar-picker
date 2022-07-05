import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  listViewContainer: {
    //flex:1,
    height: '50%',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  weekDayNames: {
    width: '100%',
    borderBottomWidth: 0.4,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDayNamesItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  month: {
    paddingBottom: 10,
  },
  monthHeader: {
    paddingTop: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  monthDays: {
    width: '100%',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  common: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
