-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_credential" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "credential_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_credential" ("created_at", "hash", "id", "updated_at", "user_id") SELECT "created_at", "hash", "id", "updated_at", "user_id" FROM "credential";
DROP TABLE "credential";
ALTER TABLE "new_credential" RENAME TO "credential";
CREATE UNIQUE INDEX "credential_user_id_key" ON "credential"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
