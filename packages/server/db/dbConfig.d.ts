type dbConfigParams = {
    [index: string]: {
        username: string
        password: string
        database: string
        host: string
        port: number
        dialect:
            | 'mysql'
            | 'postgres'
            | 'sqlite'
            | 'mariadb'
            | 'mssql'
            | 'db2'
            | 'snowflake'
            | 'oracle'
    }
}

declare const dbConfig: dbConfigParams
export default dbConfig
