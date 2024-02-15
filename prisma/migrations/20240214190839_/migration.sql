-- CreateTable
CREATE TABLE "Location" (
    "idLoc" SERIAL NOT NULL,
    "numLoc" TEXT NOT NULL,
    "nomLoc" TEXT NOT NULL,
    "designVoiture" TEXT NOT NULL,
    "nombreJour" INTEGER NOT NULL,
    "tauxJournalier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("idLoc")
);
