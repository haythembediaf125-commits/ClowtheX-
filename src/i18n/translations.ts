export type Lang = "ar" | "fr" | "en";

export interface Translation {
  appName: string;
  appTagline: string;
  nav: {
    inventory: string;
    pos: string;
    reports: string;
    settings: string;
  };
  categories: {
    shirts: string;
    pants: string;
    shoes: string;
    jackets: string;
    accessories: string;
    other: string;
  };
  inventory: {
    stats: {
      products: string;
      units: string;
      value: string;
      lowStock: string;
    };
    search: string;
    allCategories: string;
    addProduct: string;
    editProduct: string;
    empty: string;
    emptyHint: string;
    noResults: string;
    outOfStock: string;
    lowStock: string;
    sortName: string;
    sortPrice: string;
    sortQty: string;
    asc: string;
    desc: string;
  };
  pos: {
    title: string;
    search: string;
    cart: string;
    emptyCart: string;
    emptyHint: string;
    customerName: string;
    discount: string;
    paymentMethod: string;
    cash: string;
    card: string;
    other: string;
    subtotal: string;
    total: string;
    pay: string;
    saleSuccess: string;
    invoiceNo: string;
    printInvoice: string;
    invoice: string;
    date: string;
    item: string;
    qty: string;
    price: string;
    lineTotal: string;
    thanks: string;
    stockWarning: string;
    notFound: string;
  };
  reports: {
    title: string;
    revenue: string;
    profit: string;
    salesCount: string;
    avgSale: string;
    today: string;
    week: string;
    month: string;
    year: string;
    chartSales: string;
    topProducts: string;
    recentSales: string;
    noSales: string;
    units: string;
  };
  settings: {
    title: string;
    language: string;
    currency: string;
    exchangeRate: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    store: string;
    storeName: string;
    storePhone: string;
    storeAddress: string;
    saved: string;
    backup: string;
    export: string;
    exported: string;
    import: string;
    imported: string;
    importError: string;
  };
  form: {
    image: string;
    name: string;
    category: string;
    size: string;
    color: string;
    purchasePrice: string;
    salePrice: string;
    quantity: string;
    lowStockThreshold: string;
    barcode: string;
    scan: string;
    generate: string;
    printBarcode: string;
    pickImage: string;
    changeImage: string;
    required: string;
    save: string;
    cancel: string;
    delete: string;
    deleted: string;
    confirmDelete: string;
  };
  scanner: {
    title: string;
    hint: string;
    permissionDenied: string;
  };
  activation: {
    subtitle: string;
    step1: string;
    step2: string;
    scanHint: string;
    startScan: string;
    passwordPlaceholder: string;
    button: string;
    back: string;
    success: string;
    invalid: string;
    qrVerified: string;
    qrInvalid: string;
  };
}

const ar: Translation = {
  appName: "ClowtheX",
  appTagline: "إدارة محل الملابس",
  nav: {
    inventory: "المخزون",
    pos: "البيع",
    reports: "التقارير",
    settings: "الإعدادات",
  },
  categories: {
    shirts: "قمصان",
    pants: "بناطيل",
    shoes: "أحذية",
    jackets: "جاكيتات",
    accessories: "إكسسوارات",
    other: "أخرى",
  },
  inventory: {
    stats: {
      products: "المنتجات",
      units: "الوحدات",
      value: "قيمة المخزون",
      lowStock: "مخزون منخفض",
    },
    search: "بحث عن منتج أو باركود...",
    allCategories: "كل الفئات",
    addProduct: "إضافة منتج",
    editProduct: "تعديل منتج",
    empty: "المخزون فارغ",
    emptyHint: "ابدأ بإضافة منتجك الأول",
    noResults: "لا توجد نتائج",
    outOfStock: "نفد المخزون",
    lowStock: "مخزون منخفض",
    sortName: "الاسم",
    sortPrice: "السعر",
    sortQty: "الكمية",
    asc: "تصاعدي",
    desc: "تنازلي",
  },
  pos: {
    title: "نقطة البيع",
    search: "بحث عن منتج أو باركود...",
    cart: "السلة",
    emptyCart: "السلة فارغة",
    emptyHint: "ابحث عن منتج أو امسح الباركود لإضافته",
    customerName: "اسم العميل (اختياري)",
    discount: "تخفيض (د.ج)",
    paymentMethod: "طريقة الدفع",
    cash: "نقداً",
    card: "بطاقة",
    other: "أخرى",
    subtotal: "المجموع الفرعي",
    total: "الإجمالي",
    pay: "إتمام البيع",
    saleSuccess: "تمت عملية البيع بنجاح",
    invoiceNo: "رقم الفاتورة",
    printInvoice: "طباعة الفاتورة",
    invoice: "فاتورة",
    date: "التاريخ",
    item: "المنتج",
    qty: "الكمية",
    price: "السعر",
    lineTotal: "الإجمالي",
    thanks: "شكراً لتسوقكم معنا!",
    stockWarning: "الكمية المطلوبة تتجاوز المخزون المتاح",
    notFound: "لم يتم العثور على منتج بهذا الباركود",
  },
  reports: {
    title: "التقارير",
    revenue: "الإيرادات",
    profit: "الأرباح",
    salesCount: "عدد المبيعات",
    avgSale: "متوسط البيع",
    today: "اليوم",
    week: "الأسبوع",
    month: "الشهر",
    year: "السنة",
    chartSales: "مبيعات الفترة",
    topProducts: "أكثر المنتجات مبيعاً",
    recentSales: "آخر المبيعات",
    noSales: "لا توجد مبيعات في هذه الفترة",
    units: "وحدة",
  },
  settings: {
    title: "الإعدادات",
    language: "اللغة",
    currency: "العملة",
    exchangeRate: "سعر الصرف (1 EUR = ? DZD)",
    theme: "المظهر",
    themeLight: "فاتح",
    themeDark: "داكن",
    store: "معلومات المتجر",
    storeName: "اسم المتجر",
    storePhone: "رقم الهاتف",
    storeAddress: "العنوان",
    saved: "تم الحفظ بنجاح",
    backup: "النسخ الاحتياطي",
    export: "تصدير البيانات",
    exported: "تم تصدير النسخة الاحتياطية بنجاح",
    import: "استيراد البيانات",
    imported: "تم استيراد البيانات بنجاح",
    importError: "فشل استيراد الملف، تأكد من أنه ملف نسخة احتياطية صحيح",
  },
  form: {
    image: "صورة المنتج",
    name: "اسم المنتج",
    category: "الفئة",
    size: "المقاس",
    color: "اللون",
    purchasePrice: "سعر الشراء (د.ج)",
    salePrice: "سعر البيع (د.ج)",
    quantity: "الكمية",
    lowStockThreshold: "حد المخزون المنخفض",
    barcode: "الباركود",
    scan: "مسح الباركود",
    generate: "توليد باركود تلقائي",
    printBarcode: "طباعة الباركود",
    pickImage: "اختر صورة",
    changeImage: "تغيير الصورة",
    required: "هذا الحقل مطلوب",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    deleted: "تم الحذف بنجاح",
    confirmDelete: "هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.",
  },
  scanner: {
    title: "مسح الباركود",
    hint: "وجّه الكاميرا نحو الباركود أو رمز QR",
    permissionDenied: "تعذّر الوصول إلى الكاميرا — تحقق من أذونات التطبيق",
  },
  activation: {
    subtitle: "يرجى تفعيل التطبيق للمتابعة",
    step1: "امسح رمز QR للتفعيل",
    step2: "أدخل رمز التفعيل يدوياً",
    scanHint: "وجّه الكاميرا نحو رمز QR أعلاه",
    startScan: "مسح رمز QR",
    passwordPlaceholder: "أدخل رمز التفعيل...",
    button: "تفعيل",
    back: "رجوع",
    success: "تم تفعيل التطبيق بنجاح!",
    invalid: "رمز التفعيل غير صحيح، حاول مرة أخرى",
    qrVerified: "تم التحقق من رمز QR بنجاح",
    qrInvalid: "رمز QR غير صحيح، يرجى المسح مرة أخرى",
  },
};

const fr: Translation = {
  appName: "ClowtheX",
  appTagline: "Gestion de magasin de vêtements",
  nav: {
    inventory: "Inventaire",
    pos: "Ventes",
    reports: "Rapports",
    settings: "Paramètres",
  },
  categories: {
    shirts: "Chemises",
    pants: "Pantalons",
    shoes: "Chaussures",
    jackets: "Vestes",
    accessories: "Accessoires",
    other: "Autres",
  },
  inventory: {
    stats: {
      products: "Produits",
      units: "Unités",
      value: "Valeur du stock",
      lowStock: "Stock faible",
    },
    search: "Rechercher un produit ou code-barres...",
    allCategories: "Toutes catégories",
    addProduct: "Ajouter produit",
    editProduct: "Modifier produit",
    empty: "Inventaire vide",
    emptyHint: "Commencez par ajouter votre premier produit",
    noResults: "Aucun résultat",
    outOfStock: "Rupture de stock",
    lowStock: "Stock faible",
    sortName: "Nom",
    sortPrice: "Prix",
    sortQty: "Quantité",
    asc: "Croissant",
    desc: "Décroissant",
  },
  pos: {
    title: "Point de vente",
    search: "Rechercher un produit ou code-barres...",
    cart: "Panier",
    emptyCart: "Panier vide",
    emptyHint: "Recherchez un produit ou scannez un code-barres",
    customerName: "Nom du client (optionnel)",
    discount: "Remise (DZD)",
    paymentMethod: "Mode de paiement",
    cash: "Espèces",
    card: "Carte",
    other: "Autre",
    subtotal: "Sous-total",
    total: "Total",
    pay: "Finaliser la vente",
    saleSuccess: "Vente effectuée avec succès",
    invoiceNo: "N° facture",
    printInvoice: "Imprimer facture",
    invoice: "Facture",
    date: "Date",
    item: "Produit",
    qty: "Qté",
    price: "Prix",
    lineTotal: "Total",
    thanks: "Merci pour votre achat !",
    stockWarning: "Quantité demandée supérieure au stock disponible",
    notFound: "Aucun produit trouvé avec ce code-barres",
  },
  reports: {
    title: "Rapports",
    revenue: "Revenus",
    profit: "Bénéfices",
    salesCount: "Nombre de ventes",
    avgSale: "Vente moyenne",
    today: "Aujourd'hui",
    week: "Semaine",
    month: "Mois",
    year: "Année",
    chartSales: "Ventes de la période",
    topProducts: "Produits les plus vendus",
    recentSales: "Ventes récentes",
    noSales: "Aucune vente sur cette période",
    units: "unité",
  },
  settings: {
    title: "Paramètres",
    language: "Langue",
    currency: "Devise",
    exchangeRate: "Taux de change (1 EUR = ? DZD)",
    theme: "Thème",
    themeLight: "Clair",
    themeDark: "Sombre",
    store: "Informations magasin",
    storeName: "Nom du magasin",
    storePhone: "Téléphone",
    storeAddress: "Adresse",
    saved: "Sauvegardé avec succès",
    backup: "Sauvegarde",
    export: "Exporter les données",
    exported: "Sauvegarde exportée avec succès",
    import: "Importer les données",
    imported: "Données importées avec succès",
    importError: "Échec de l'importation — vérifiez que le fichier est valide",
  },
  form: {
    image: "Image du produit",
    name: "Nom du produit",
    category: "Catégorie",
    size: "Taille",
    color: "Couleur",
    purchasePrice: "Prix d'achat (DZD)",
    salePrice: "Prix de vente (DZD)",
    quantity: "Quantité",
    lowStockThreshold: "Seuil de stock faible",
    barcode: "Code-barres",
    scan: "Scanner le code-barres",
    generate: "Générer automatiquement",
    printBarcode: "Imprimer le code-barres",
    pickImage: "Choisir une image",
    changeImage: "Changer l'image",
    required: "Ce champ est obligatoire",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    deleted: "Supprimé avec succès",
    confirmDelete: "Confirmer la suppression ? Cette action est irréversible.",
  },
  scanner: {
    title: "Scanner le code-barres",
    hint: "Pointez la caméra vers le code-barres ou QR code",
    permissionDenied: "Impossible d'accéder à la caméra — vérifiez les permissions",
  },
  activation: {
    subtitle: "Veuillez activer l'application pour continuer",
    step1: "Scannez le QR code pour activer",
    step2: "Saisissez le code d'activation manuellement",
    scanHint: "Pointez la caméra vers le QR code ci-dessus",
    startScan: "Scanner le QR code",
    passwordPlaceholder: "Entrez le code d'activation...",
    button: "Activer",
    back: "Retour",
    success: "Application activée avec succès !",
    invalid: "Code d'activation incorrect, veuillez réessayer",
    qrVerified: "QR code vérifié avec succès",
    qrInvalid: "QR code incorrect, veuillez rescanner",
  },
};

const en: Translation = {
  appName: "ClowtheX",
  appTagline: "Clothing Store Manager",
  nav: {
    inventory: "Inventory",
    pos: "Sales",
    reports: "Reports",
    settings: "Settings",
  },
  categories: {
    shirts: "Shirts",
    pants: "Pants",
    shoes: "Shoes",
    jackets: "Jackets",
    accessories: "Accessories",
    other: "Other",
  },
  inventory: {
    stats: {
      products: "Products",
      units: "Units",
      value: "Stock Value",
      lowStock: "Low Stock",
    },
    search: "Search product or barcode...",
    allCategories: "All categories",
    addProduct: "Add product",
    editProduct: "Edit product",
    empty: "Inventory is empty",
    emptyHint: "Start by adding your first product",
    noResults: "No results found",
    outOfStock: "Out of stock",
    lowStock: "Low stock",
    sortName: "Name",
    sortPrice: "Price",
    sortQty: "Quantity",
    asc: "Ascending",
    desc: "Descending",
  },
  pos: {
    title: "Point of Sale",
    search: "Search product or barcode...",
    cart: "Cart",
    emptyCart: "Cart is empty",
    emptyHint: "Search for a product or scan a barcode to add it",
    customerName: "Customer name (optional)",
    discount: "Discount (DZD)",
    paymentMethod: "Payment method",
    cash: "Cash",
    card: "Card",
    other: "Other",
    subtotal: "Subtotal",
    total: "Total",
    pay: "Complete sale",
    saleSuccess: "Sale completed successfully",
    invoiceNo: "Invoice #",
    printInvoice: "Print invoice",
    invoice: "Invoice",
    date: "Date",
    item: "Item",
    qty: "Qty",
    price: "Price",
    lineTotal: "Total",
    thanks: "Thank you for shopping with us!",
    stockWarning: "Requested quantity exceeds available stock",
    notFound: "No product found with this barcode",
  },
  reports: {
    title: "Reports",
    revenue: "Revenue",
    profit: "Profit",
    salesCount: "Sales count",
    avgSale: "Average sale",
    today: "Today",
    week: "Week",
    month: "Month",
    year: "Year",
    chartSales: "Period sales",
    topProducts: "Top selling products",
    recentSales: "Recent sales",
    noSales: "No sales in this period",
    units: "unit",
  },
  settings: {
    title: "Settings",
    language: "Language",
    currency: "Currency",
    exchangeRate: "Exchange rate (1 EUR = ? DZD)",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    store: "Store information",
    storeName: "Store name",
    storePhone: "Phone number",
    storeAddress: "Address",
    saved: "Saved successfully",
    backup: "Backup & Restore",
    export: "Export data",
    exported: "Backup exported successfully",
    import: "Import data",
    imported: "Data imported successfully",
    importError: "Import failed — make sure the file is a valid backup",
  },
  form: {
    image: "Product image",
    name: "Product name",
    category: "Category",
    size: "Size",
    color: "Color",
    purchasePrice: "Purchase price (DZD)",
    salePrice: "Sale price (DZD)",
    quantity: "Quantity",
    lowStockThreshold: "Low stock threshold",
    barcode: "Barcode",
    scan: "Scan barcode",
    generate: "Auto-generate barcode",
    printBarcode: "Print barcode",
    pickImage: "Pick image",
    changeImage: "Change image",
    required: "This field is required",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    deleted: "Deleted successfully",
    confirmDelete: "Confirm deletion? This action cannot be undone.",
  },
  scanner: {
    title: "Scan barcode",
    hint: "Point camera at barcode or QR code",
    permissionDenied: "Cannot access camera — check app permissions",
  },
  activation: {
    subtitle: "Please activate the app to continue",
    step1: "Scan the QR code to activate",
    step2: "Enter the activation code manually",
    scanHint: "Point camera at the QR code above",
    startScan: "Scan QR code",
    passwordPlaceholder: "Enter activation code...",
    button: "Activate",
    back: "Back",
    success: "App activated successfully!",
    invalid: "Invalid activation code, please try again",
    qrVerified: "QR code verified successfully",
    qrInvalid: "Invalid QR code, please scan again",
  },
};

export const translations: Record<Lang, Translation> = { ar, fr, en };
