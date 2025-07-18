import "dotenv/config"
import "reflect-metadata"

import { v4 as uuidv4 } from "uuid"

import { ERole } from "src/types/enum"

import initializeFirebase, { getFirestore } from "../config/firebase.config"
import { type User } from "../types/models"

const instructors: User[] = [
  {
    id: uuidv4(),
    username: "john456",
    phone: "0123456789",
    role: ERole.INSTRUCTOR,
  },
  {
    id: uuidv4(),
    username: "amy123",
    phone: "0987654321",
    role: ERole.INSTRUCTOR,
  },
]

async function seedInstructors() {
  try {
    // Initialize Firebase
    initializeFirebase()

    //Seed instructors
    if ((await getFirestore().collection("users").get()).size === 0) {
      for (const instructor of instructors) {
        try {
          await getFirestore()
            .collection("users")
            .doc(instructor.id)
            .set(instructor)
        } catch (error) {
          console.error(error)
        }
      }
    }

    console.log("Seeding completed!")

    process.exit(0)
  } catch (error) {
    console.error("Seeding failed:", error)
    process.exit(1)
  }
}

// Run the seeding function
seedInstructors()
