/* ============================================================
   VAART — canonical provider data (shared by all modules)
   ============================================================ */

export const PROVIDERS = [
  { name: 'Lovers Canal Cruises', cat: 'Klassieke rondvaart', tag: 'De iconische glazen-dak rondvaart, 75 min door de grachtengordel.', price: 'vanaf €18', group: 'klassiek' },
  { name: 'Blue Boat Company', cat: 'Klassieke rondvaart', tag: 'Eén uur door het hart van de grachten, meertalige audiogids.', price: 'vanaf €18', group: 'klassiek' },
  { name: 'Stromma Canal Tours', cat: 'Klassieke rondvaart', tag: 'Hop-on hop-off langs alle hotspots, de hele dag geldig.', price: 'vanaf €20', group: 'klassiek' },
  { name: 'Amsterdam Circle Line', cat: 'Hop-on hop-off', tag: 'Uitstappen waar je wilt, ticket 24 uur geldig.', price: 'vanaf €22', group: 'klassiek' },
  { name: 'Rederij P. Kooij', cat: 'Klassiek', tag: 'Kleinschalig en authentiek Amsterdams, al decennia.', price: 'vanaf €16', group: 'klassiek' },
  { name: 'Flagship Amsterdam', cat: 'Open boot', tag: 'De gezellige open boot met kapitein — de lokale favoriet.', price: 'vanaf €24', group: 'open' },
  { name: 'KINboat', cat: 'Open elektrische boot', tag: '100% elektrisch varen door de grachten, klein en persoonlijk.', price: 'vanaf €22', group: 'open' },
  { name: 'Those Dam Boat Guys', cat: 'Open boot', tag: 'Kleine open boten, verhalen van echte locals.', price: 'vanaf €28', group: 'open' },
  { name: 'Pure Boats Amsterdam', cat: 'Open boot', tag: 'Privé- en kleine groepen, rustig en op maat.', price: 'vanaf €25', group: 'open' },
  { name: 'Starboard Boats', cat: 'Open boot', tag: 'Open vaart met kapitein, dagelijks vertrek.', price: 'vanaf €24', group: 'open' },
  { name: 'Friendship Amsterdam', cat: 'Open boot', tag: 'Luxe open boot, all-inclusive optie aan boord.', price: 'vanaf €30', group: 'open' },
  { name: 'Mokumboot', cat: 'Open boot', tag: 'Open boot door de grachten, vriendelijk geprijsd.', price: 'vanaf €20', group: 'open' },
  { name: 'Eco Boats Amsterdam', cat: 'Elektrische boot', tag: 'Duurzaam en emissievrij varen door de stad.', price: 'vanaf €21', group: 'open' },
  { name: 'Voyage Amsterdam', cat: 'Open boot', tag: 'Kleine open rondvaart met persoonlijke aandacht.', price: 'vanaf €20', group: 'open' },
  { name: 'Water Colors', cat: 'Open boot', tag: 'Kunst en cultuur op het water, iets anders dan doorsnee.', price: 'vanaf €22', group: 'open' },
  { name: 'Amsterdam Boat Center', cat: 'Open boot', tag: 'Centraal gelegen, dagelijks vertrekken.', price: 'vanaf €19', group: 'open' },
  { name: 'Amsterdam Boat Adventures', cat: 'Open boot', tag: 'Avontuurlijke vaartochten net buiten de drukte.', price: 'vanaf €23', group: 'open' },
  { name: 'Boaty Amsterdam', cat: 'Zelf varen', tag: 'Huur je eigen bootje en stuur zelf door de grachten.', price: 'vanaf €45/uur', group: 'zelf' },
  { name: 'Sloepdelen', cat: 'Zelf varen', tag: 'Deel een sloep per uur — geen vaarbewijs nodig.', price: 'vanaf €40/uur', group: 'zelf' },
  { name: "Adam's Boats", cat: 'Zelf varen', tag: 'Zelf sturen, eenvoudig en zonder ervaring.', price: 'vanaf €50', group: 'zelf' },
  { name: 'Canal Motorboats', cat: 'Zelf varen', tag: 'Eigen motorboot door de grachten, maximale vrijheid.', price: 'vanaf €60', group: 'zelf' },
  { name: 'Amsterdam Jewel Cruises', cat: 'Diner cruise', tag: 'Luxe diner op het water bij kaarslicht.', price: 'vanaf €90', group: 'diner' },
  { name: "Rederij 't Smidtje", cat: 'Diner cruise', tag: 'Klassiek diner op een historisch salonschip.', price: 'vanaf €85', group: 'diner' },
  { name: 'Candlelight Cruises', cat: 'Diner cruise', tag: 'Wijn en kaas bij kaarslicht, 2 uur door de grachten.', price: 'vanaf €55', group: 'diner' },
  { name: 'Wetlands Safari', cat: 'Natuur', tag: 'Naar de stilte van de Waterlandse wetlands, net buiten de stad.', price: 'vanaf €35', group: 'natuur' }
];

export const GROUPS = {
  klassiek: { label: 'Klassieke rondvaart', color: '#6aa79c' },
  open:     { label: 'Open boot',           color: '#c6533a' },
  zelf:     { label: 'Zelf varen',          color: '#d8a13a' },
  diner:    { label: 'Diner cruise',        color: '#8a3b5c' },
  natuur:   { label: 'Natuur',              color: '#7d9a6a' }
};

export const GROUP_ORDER = ['klassiek', 'open', 'zelf', 'diner', 'natuur'];
