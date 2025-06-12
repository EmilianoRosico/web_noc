/*
  Warnings:

  - Added the required column `name` to the `AclEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AclEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "subnet" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_AclEntry" ("id", "subnet", "type") SELECT "id", "subnet", "type" FROM "AclEntry";
DROP TABLE "AclEntry";
ALTER TABLE "new_AclEntry" RENAME TO "AclEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
