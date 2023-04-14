## starta appen

$ npm run start

### .env

example.env innehåller config för cookie_secret och api-nyckel. Bara döp om filen till .env

#### Bli medlem

http://localhost:4000/register
Fyll i namn, epost och lösenord

#### Logga in

http://localhost:4000/
Fyll i epost och lösenord

#### Kategorier & produkter

- Enbart inloggade användare ser kategorier och produkter
- Enbart produkter som tillhör existerande kategori visas i butiken

#### Antal och Köp av produkt

Välj antalet av en produkt och klicka på köp för att lägga i varukorgen

#### Varukorgen

http://localhost:4000/cart

- Visas enbart när det finns produkter i varukorgen
- Kliocka på Place Order för att skapa order

#### Dina orders

http://localhost:4000/orders
Visar dina orders ifall de finns några
