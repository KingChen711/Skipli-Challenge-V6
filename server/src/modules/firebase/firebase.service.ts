import { injectable } from "inversify"

import { getFirestore } from "../../config/firebase.config"

@injectable()
export class FirebaseService {
  public db = getFirestore()
}
