/**
 * Loopback query filters. For more info: https://docs.strongloop.com/display/public/LB/Querying+data
 */
export interface ILoopbackFilter {
  fields?: any;
  include?: any;
  limit?: number;
  order?: string | string[];
  skip?: number;
  where?: any;
  deleted?: boolean;
}
