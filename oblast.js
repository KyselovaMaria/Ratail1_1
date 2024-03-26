const oblasts = [
    "Vinnytsia Oblast",
    "Volyn Oblast",
    "Dnipropetrovsk Oblast",
    "Donetsk Oblast",
    "Zhytomyr Oblast",
    "Zakarpattia Oblast",
    "Zaporizhzhia Oblast",
    "Ivano-Frankivsk Oblast",
    "Kyiv Oblast",
    "Kirovohrad Oblast",
    "Luhansk Oblast",
    "Lviv Oblast",
    "Mykolaiv Oblast",
    "Odessa Oblast",
    "Poltava Oblast",
    "Rivne Oblast",
    "Sumy Oblast",
    "Ternopil Oblast",
    "Kharkiv Oblast",
    "Kherson Oblast",
    "Khmelnytskyi Oblast",
    "Cherkasy Oblast",
    "Chernivtsi Oblast",
    "Chernihiv Oblast"
]
const warehouse = {
    "Kyiv": ["Kyiv Oblast", "Zhytomyr Oblast", "Cherkasy Oblast", "Chernihiv Oblast"],
    "Ivano-Frankivsk": ["Ivano-Frankivsk Oblast", "Zaporizhzhia Oblast", "Lviv Oblast", "Chernivtsi Oblast", "Ternopil Oblast"],
    "Rivne": ["Rivne Oblast", "Volyn Oblast", "Khmelnytskyi Oblast"],
    "Kharkiv": ["Kharkiv Oblast", "Donetsk Oblast", "Luhansk Oblast", "Poltava Oblast", "Sumy Oblast"],
    "Dnipropetrovsk": ["Dnipropetrovsk Oblast", "Kherson Oblast", "Zaporizhzhia Oblast", "Kirovohrad Oblast"],
    "Odessa": ["Odessa Oblast", "Vinnytsia Oblast", "Mykolaiv Oblast"]
};
{
    name: "KyivStorege";
    address: "Gnata Khotkevych Lane, 8, Kyiv, 02660";
}
{
    name: "RivneStorege";
    address: "23 Mlynivska Street, Rivne, 33024";
}
{
    name: "KharkivStorege";
    address: "8 Yenakiivska Street, Kharkiv, 61046";
}
{
    name: "OdessaStorege";
    address: "108 Balkovska Street, Odessa, 65005";
}
{
    name: "CherkasyStorege";
    address: "3 Chornovola Street, Cherkasy, 18005";
}
{
    name: "KhersonStorege";
    address: "11 Novozavodska Street, Kherson, 18029";
}



{
    lastName: "Voloshyn";
    firstName: "Alexander";
    patronymic: "Mykolaiovych";
    phone: "0668976754";
    email: "voloalex89@gmail.com";
    shippingAdress: "56 Antonovycha Street, Kyiv";
}

{
    lastName: "Soroka";
    firstName: "Miron";
    patronymic: "Oleksandrovych";
    phone: "0981198012";
    email: "soroooka@gmail.com";
    shippingAdress: "63 Viflyemska Street, Kyiv";
}
{
    lastName: "Ponchuk";
    firstName: "Margaryta";
    patronymic: "Volodymyrivna";
    phone: "0679970583";
    email: "margarytaponchuk@gmail.com";
    shippingAdress: "34 Vasylia Stusa Street, Odesa";
}
{
    lastName: "Baranetska";
    firstName: "Sophia";
    patronymic: "Volodymyrivna";
    phone: "0509765509";
    email: "sonia001@gmail.com";
    shippingAdress: "8 Pochtova Street, Odesa";
}
{
    lastName: "Prokopchuk";
    firstName: "Artem";
    patronymic: "Pavlovych";
    phone: "0660095677";
    email: "prokopchuk@gmail.com";
    shippingAdress: "17 Koliina Street, Poltava";
}
{
    lastName: "Shabala";
    firstName: "Petro ";
    patronymic: "Bohdanovych";
    phone: "0985043289";
    email: "petroshabala@gmail.com";
    shippingAdress: "35 Yevhena Sverstiuka Street, Poltava";
}
{
    lastName: "Scyra";
    firstName: "Angelina";
    patronymic: "Petrivna";
    phone: "0956784328";
    email: "angelscyra@gmail.com";
    shippingAdress: "42 Oleksandra Anishchenka Street, Sumy";
}
{
    lastName: "Chernyshyn";
    firstName: "Zakhar";
    patronymic: "Mykolaiovych";
    phone: "0508984539";
    email: "zakhar444@gmail.com";
    shippingAdress: "5 Panteleimonivska Street, Sumy";
}

{
    name: "Cement(25 kg)";
    price: 145;
    minimumStock: 10;
}

{
    name: "Sand(1000 kg)";
    price: 500;
    minimumStock: 20;
}

{
    name: "Gravel(1000 kg)";
    price: 1600;
    minimumStock: 5;
}

{
    name: "Bricks(100 pieces)";
    price: 600;
    minimumStock: 50;
}