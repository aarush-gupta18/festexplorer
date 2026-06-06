import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 50},
  heading: {
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingVertical: 5},
  display: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12},
  box: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    width: 210,
    height: 100,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'},
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center'},
  tablayout: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 30},
  tab: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center'},
  currenttab: {
    borderTopWidth: 3},
  tabtext: {
    fontSize: 14,
    fontWeight: '600'},
});
export default styles;