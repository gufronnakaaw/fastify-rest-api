export default interface Response<T> {
  success: true;
  data: T;
  errors: null;
}
