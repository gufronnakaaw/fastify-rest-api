export default interface Response<T> {
  success: boolean;
  data?: T;
  errors: null;
}
