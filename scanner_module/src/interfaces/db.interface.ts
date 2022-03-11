export interface dbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  pool: {
    min: number;
    max: number;
  };
}
