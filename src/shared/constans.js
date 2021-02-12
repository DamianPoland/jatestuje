import CAR from '../assets/car.jpg'

export const PRIVACY_POLICY_PERMISSION = 'PRIVACY_POLICY_PERMISSION'

// authentications
export const IS_AUTH = 'IS_AUTH'
export const USER_ID = 'USER_ID'
export const USER_NAME = 'USER_NAME'
export const USER_EMAIL = 'USER_EMAIL'
export const USER_PHOTO = 'USER_PHOTO'

// paiments
export const PAYMENTS = "payments"
export const POINTS = "points"

// main firebase collections

export const USERS = 'users'
export const ADS = 'ads'
export const CARS = { name: "Osobowe", nameDB: "cars", photo: CAR }
export const MOTORCYCLES = { name: "Motocykle", nameDB: "motorcycles", photo: CAR }
export const TRUCKS = { name: "Ciężarowe", nameDB: "trucks", photo: CAR }
export const TRAILERS = { name: "Przyczepy", nameDB: "trailers", photo: CAR }
export const BUILD = { name: "Budowlane", nameDB: "build", photo: CAR }
export const AGRICULTURE = { name: "Rolnicze", nameDB: "agriculture", photo: CAR }
export const ELECTRONICS = { name: "Elektronika", nameDB: "electronics", photo: CAR }
// export const DRONES = { name: "Drony", nameDB: "drones", photo: CAR }
// export const CAMERAS = { name: "Kamery", nameDB: "cameras", photo: CAR }
export const OTHERS = { name: "Pozostałe", nameDB: "others", photo: CAR }

const motorcycles = []

const others = []

const trucks = [
    "",
    "Betonomieszarka",
    "Autobus",
    "Inny",
    "Ciągnik siodłowy",
    "Chłodnia i izotermy",
    "Dźwigi, żurawie, podnośniki mobilne",
    "Wywrotka",
    "Kontener",
    "Plandeka (firana)",
    "Pompa do betonu",
    "Cysterna",
    "Autolaweta",
    "Pojazdy do zabudowy",
    "Pojazdy użyteczności publicznej",
    "Skrzynia",
    "Specjalny",
    "Zestaw (ciągnik z naczepą/przyczepą)",
    "Hakowce i bramowce",
    "Akcesoria do pojazdów ciężarowych",
]

const trailers = [
    "",
    "Przyczepy pozostałe",
    "Przyczepy kempingowe",
    "Naczepy pozostałe",
    "Przyczepy do samochodów osobowych",
    "Przyczepy wywrotki",
    "Naczepy burtowe i plandeki",
    "Naczepy chłodnie i izotermy",
    "Naczepy z ruchomą podłogą",
    "Naczepy cysterny",
    "Naczepy do przewozu pojazdów",
    "Naczepy niskopodłogowe",
    "Naczepy pod kontener",
    "Naczepy wywrotki",
    "Przyczepy burtowe i plandeki",
    "Przyczepy chłodnie i izotermy",
    "Przyczepy cysterny",
    "Przyczepy do przewozu pojazdów",
    "Przyczepy gastronomiczne",
    "Przyczepy kontenery",
    "Akcesoria do przyczep",
]

const build = [
    "",
    "Akcesoria do maszyn",
    "Koparko-ładowarki",
    "Spycharki",
    "Dźwigi, żurawie, podnośniki",
    "Koparki gąsienicowe",
    "Koparki kołowe",
    "Minikoparki",
    "Wózki widłowe",
    "Ładowarki",
    "Inne",
    "Generatory (agregaty)",
    "Maszyny drogowe",
    "Wozidła",
    "Kruszarki i przesiewacze",
]


const agriculture = [
    "",
    "Ciągniki (traktory)",
    "Kombajny",
    "Agregaty",
    "Pługi",
    "Rozsiewacze",
    "Kosiarki",
    "Ładowacze czołowe",
    "Prasy i owijarki",
    "Opryskiwacze",
    "Sadzarki i siewniki",
    "Maszyny leśne",
    "Inne maszyny rolnicze",
    "Maszyny dla hodowli zwierząt",
    "Przyczepy rolnicze",
    "Akcesoria do maszyn rolniczych/hedery/przystawki",
    "Ładowarki teleskopowe i miniładowarki",
    "Rozrzutniki obornika",
    "Sieczkarnie",
]

const electronics = [
    "",
    "Drones",
    "Cameras",
    "Pozostałe",
]