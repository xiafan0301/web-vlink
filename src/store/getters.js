export default {
  filterMyArray: state => {
    return state.myArray.map(x => x * x);
    //  return state.myArray.filter( value => value >= 2 );
  }
}