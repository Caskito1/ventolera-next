
import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function useUserData() {
  const [userData, setUserData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push("/log-in");

      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);

        const favCol = collection(db, "usuarios", user.uid, "favoritos");
        const favSnap = await getDocs(favCol);
        setFavorites(favSnap.docs.map(doc => doc.id));
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { userData, favorites, setFavorites };
}
