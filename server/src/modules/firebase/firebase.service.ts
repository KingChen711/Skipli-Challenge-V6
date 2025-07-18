import { injectable } from "inversify"

import { getFirestore } from "../../config/firebase"

@injectable()
export class FirebaseService {
  public db = getFirestore()
}
