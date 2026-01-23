package database

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func DatabaseConn(databaseURL string) *sql.DB {
	if databaseURL == "" {
		log.Fatalf("DATABASE_URL must be set")
	}

	db, err := sql.Open("mysql", databaseURL)
	if err != nil {
		log.Fatal("failed to open database: check url")
	}

	for i := 0; i < 10; i++ {
		err = db.Ping()

		if err == nil {
			log.Println("database connected")
			break
		}

		log.Printf("failed to connect to database, trying again. Attempt %v", i)
		time.Sleep(2 * time.Second)
		if i == 9 {
			log.Fatal("failed to connect to database after 10 attempts")
		}
	}

	// if err := runInitSQL(db); err != nil {
	// 	log.Fatalf("failed to initialize database: %v", err)
	// }

	// fmt.Println("database initialized")
	return db
}

// func runInitSQL(db *sql.DB) error {
// 	statements := strings.Split(initSQL, ";")
// 	for _, stmt := range statements {
// 		stmt = strings.TrimSpace(stmt)
// 		if stmt == "" {
// 			continue
// 		}
// 		if _, err := db.Exec(stmt); err != nil {
// 			return fmt.Errorf("failed to execute statement %q: %w", stmt, err)
// 		}
// //go:embed migration/init.sql
// var initSQL string
// 	}

// 	return nil
// }
