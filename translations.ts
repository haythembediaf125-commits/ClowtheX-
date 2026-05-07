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
    qrVerified: string;
    qrInvalid: string;
    success: string;
    invalid: string;
  };
  inventory: {
    addProduct: string;
    editProduct: string;
    search: string;
    allCategories: string;
    sortName: string;
    sortPrice: string;
    sortQty: string;
    asc: string;
    desc: string;
    empty: string;
    emptyHint: string;
    noResults: string;
    lowStock: string;
    outOfStock: string;
    stats: {
      products: string;
      units: string;
      value: string;
      lowStock: string;
    };
  };
  form: {
    save: string;
    cancel: string;
    delete: string;
    deleted: string;
    saved: string;
    required: string;
    name: string;
    category: string;
    color: string;
    size: string;
    quantity: string;
    purchasePrice: string;
    salePrice: string;
    lowStockThreshold: string;
    barcode: string;
    scan: string;
    generate: string;
    image: string;
    pickImage: string;
    changeImage: string;
    printBarcode: string;
    confirmDelete: string;
  };
  pos: {
    title: string;
    search: string;
    notFound: string;
    cart: string;
    emptyCart: string;
    emptyHint: string;
    qty: string;
    price: string;
    lineTotal: string;
    subtotal: string;
    discount: string;
    total: string;
    paymentMethod: string;
    cash: string;
    card: string;
    other: string;
    customerName: string;
    pay: string;
    saleSuccess: string;
    stockWarning: string;
    invoice: string;
    invoiceNo: string;
    date: string;
    item: string;
    printInvoice: string;
    thanks: string;
  };
  reports: {
    title: string;
    today: string;
    week: string;
    month: string;
    year: string;
    revenue: string;
    profit: string;
    salesCount: string;
    avgSale: string;
    topProducts: string;
    recentSales: string;
    units: string;
    noSales: string;
    chartSales: string;
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
    import: string;
    exported: string;
    imported: string;
    importError: string;
  };
}

export const translations: Record<Lang, Translation> = {
  ar: {
    appName: "ClowtheX",
    appTagline: "إدارة محل الملابس",
    nav: {
      inventory: "المخزون",
      pos: "نقطة البيع",
      reports: "التقارير",
      settings: "الإعدادات",
    },
    scanner: {
      title: "مسح الباركود",
      hint: "وجّه الكاميرا نحو الباركود",
      permissionDenied: "لا يمكن الوصول إلى الكاميرا",
    },
    activation: {
      subtitle: "يرجى تفعيل التطبيق للمتابعة",
      step1: "امسح رمز QR للتفعيل",
      step2: "أدخل كلمة المرور",
      scanHint: "وجّه الكاميرا نحو رمز QR أعلاه",
      startScan: "بدء المسح",
      passwordPlaceholder: "كلمة المرور",
      button: "تفعيل",
      back: "رجوع",
      qrVerified: "تم التحقق من رمز QR",
      qrInvalid: "رمز QR غير صحيح",
      success: "تم تفعيل التطبيق بنجاح",
      invalid: "كلمة المرور غير صحيحة",
    },
    inventory: {
      addProduct: "إضافة منتج",
      editProduct: "تعديل المنتج",
      search: "بحث عن منتج...",
      allCategories: "جميع الفئات",
      sortName: "الاسم",
      sortPrice: "السعر",
      sortQty: "الكمية",
      asc: "تصاعدي",
      desc: "تنازلي",
      empty: "المخزون فارغ",
      emptyHint: "ابدأ بإضافة منتجاتك",
      noResults: "لا توجد نتائج",
      lowStock: "مخزون منخفض",
      outOfStock: "نفد المخزون",
      stats: {
        products: "منتجات",
        units: "وحدات",
        value: "القيمة",
        lowStock: "مخزون منخفض",
      },
    },
    form: {
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      deleted: "تم الحذف",
      saved: "تم الحفظ",
      required: "هذا الحقل مطلوب",
      name: "اسم المنتج",
      category: "الفئة",
      color: "اللون",
      size: "المقاس",
      quantity: "الكمية",
      purchasePrice: "سعر الشراء",
      salePrice: "سعر البيع",
      lowStockThreshold: "حد المخزون المنخفض",
      barcode: "الباركود",
      scan: "مسح",
      generate: "توليد",
      image: "الصورة",
      pickImage: "اختر صورة",
      changeImage: "تغيير الصورة",
      printBarcode: "طباعة الباركود",
      confirmDelete: "هل تريد حذف هذا المنتج؟",
    },
    pos: {
      title: "نقطة البيع",
      search: "ابحث عن منتج أو امسح الباركود...",
      notFound: "لم يتم العثور على المنتج",
      cart: "السلة",
      emptyCart: "السلة فارغة",
      emptyHint: "ابحث عن منتج لإضافته",
      qty: "الكمية",
      price: "السعر",
      lineTotal: "المجموع",
      subtotal: "المجموع الفرعي",
      discount: "الخصم",
      total: "الإجمالي",
      paymentMethod: "طريقة الدفع",
      cash: "نقداً",
      card: "بطاقة",
      other: "أخرى",
      customerName: "اسم العميل",
      pay: "إتمام البيع",
      saleSuccess: "تمت عملية البيع بنجاح",
      stockWarning: "الكمية المطلوبة تتجاوز المخزون",
      invoice: "فاتورة",
      invoiceNo: "رقم الفاتورة",
      date: "التاريخ",
      item: "المنتج",
      printInvoice: "طباعة الفاتورة",
      thanks: "شكراً لتسوقكم معنا",
    },
    reports: {
      title: "التقارير",
      today: "اليوم",
      week: "الأسبوع",
      month: "الشهر",
      year: "السنة",
      revenue: "الإيرادات",
      profit: "الربح",
      salesCount: "عدد المبيعات",
      avgSale: "متوسط البيع",
      topProducts: "أكثر المنتجات مبيعاً",
      recentSales: "آخر المبيعات",
      units: "وحدة",
      noSales: "لا توجد مبيعات",
      chartSales: "مبيعات",
    },
    settings: {
      title: "الإعدادات",
      language: "اللغة",
      currency: "العملة",
      exchangeRate: "سعر الصرف (1€ = د.ج)",
      theme: "المظهر",
      themeLight: "فاتح",
      themeDark: "داكن",
      store: "معلومات المتجر",
      storeName: "اسم المتجر",
      storePhone: "رقم الهاتف",
      storeAddress: "العنوان",
      saved: "تم حفظ الإعدادات بنجاح",
      backup: "النسخ الاحتياطي",
      export: "تصدير البيانات",
      import: "استيراد البيانات",
      exported: "تم تصدير النسخة الاحتياطية بنجاح",
      imported: "تم استيراد البيانات بنجاح",
      importError: "فشل استيراد الملف، تأكد من أنه ملف نسخة احتياطية صحيح",
    },
  },

  fr: {
    appName: "ClowtheX",
    appTagline: "Gestion de boutique",
    nav: {
      inventory: "Inventaire",
      pos: "Vente",
      reports: "Rapports",
      settings: "Paramètres",
    },
    scanner: {
      title: "Scanner le code",
      hint: "Pointez la caméra vers le code-barres",
      permissionDenied: "Accès à la caméra refusé",
    },
    activation: {
      subtitle: "Veuillez activer l'application pour continuer",
      step1: "Scannez le QR code pour activer",
      step2: "Entrez le mot de passe",
      scanHint: "Pointez la caméra vers le QR code ci-dessus",
      startScan: "Commencer le scan",
      passwordPlaceholder: "Mot de passe",
      button: "Activer",
      back: "Retour",
      qrVerified: "QR code vérifié",
      qrInvalid: "QR code invalide",
      success: "Application activée avec succès",
      invalid: "Mot de passe incorrect",
    },
    inventory: {
      addProduct: "Ajouter un produit",
      editProduct: "Modifier le produit",
      search: "Rechercher un produit...",
      allCategories: "Toutes les catégories",
      sortName: "Nom",
      sortPrice: "Prix",
      sortQty: "Quantité",
      asc: "Croissant",
      desc: "Décroissant",
      empty: "Inventaire vide",
      emptyHint: "Commencez par ajouter vos produits",
      noResults: "Aucun résultat",
      lowStock: "Stock faible",
      outOfStock: "Rupture de stock",
      stats: {
        products: "Produits",
        units: "Unités",
        value: "Valeur",
        lowStock: "Stock faible",
      },
    },
    form: {
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      deleted: "Supprimé",
      saved: "Enregistré",
      required: "Ce champ est obligatoire",
      name: "Nom du produit",
      category: "Catégorie",
      color: "Couleur",
      size: "Taille",
      quantity: "Quantité",
      purchasePrice: "Prix d'achat",
      salePrice: "Prix de vente",
      lowStockThreshold: "Seuil stock faible",
      barcode: "Code-barres",
      scan: "Scanner",
      generate: "Générer",
      image: "Image",
      pickImage: "Choisir une image",
      changeImage: "Changer l'image",
      printBarcode: "Imprimer le code-barres",
      confirmDelete: "Voulez-vous supprimer ce produit ?",
    },
    pos: {
      title: "Point de vente",
      search: "Rechercher ou scanner...",
      notFound: "Produit introuvable",
      cart: "Panier",
      emptyCart: "Panier vide",
      emptyHint: "Recherchez un produit à ajouter",
      qty: "Qté",
      price: "Prix",
      lineTotal: "Total",
      subtotal: "Sous-total",
      discount: "Remise",
      total: "Total",
      paymentMethod: "Mode de paiement",
      cash: "Espèces",
      card: "Carte",
      other: "Autre",
      customerName: "Nom du client",
      pay: "Valider la vente",
      saleSuccess: "Vente effectuée avec succès",
      stockWarning: "Quantité demandée supérieure au stock",
      invoice: "Facture",
      invoiceNo: "N° Facture",
      date: "Date",
      item: "Article",
      printInvoice: "Imprimer la facture",
      thanks: "Merci pour votre achat",
    },
    reports: {
      title: "Rapports",
      today: "Aujourd'hui",
      week: "Semaine",
      month: "Mois",
      year: "Année",
      revenue: "Chiffre d'affaires",
      profit: "Bénéfice",
      salesCount: "Nombre de ventes",
      avgSale: "Vente moyenne",
      topProducts: "Produits les plus vendus",
      recentSales: "Dernières ventes",
      units: "unité",
      noSales: "Aucune vente",
      chartSales: "Ventes",
    },
    settings: {
      title: "Paramètres",
      language: "Langue",
      currency: "Devise",
      exchangeRate: "Taux de change (1€ = DZD)",
      theme: "Thème",
      themeLight: "Clair",
      themeDark: "Sombre",
      store: "Informations du magasin",
      storeName: "Nom du magasin",
      storePhone: "Téléphone",
      storeAddress: "Adresse",
      saved: "Paramètres enregistrés",
      backup: "Sauvegarde",
      export: "Exporter les données",
      import: "Importer les données",
      exported: "Sauvegarde exportée avec succès",
      imported: "Données importées avec succès",
      importError: "Échec de l'importation, vérifiez le fichier",
    },
  },

  en: {
    appName: "ClowtheX",
    appTagline: "Clothing Store Manager",
    nav: {
      inventory: "Inventory",
      pos: "Point of Sale",
      reports: "Reports",
      settings: "Settings",
    },
    scanner: {
      title: "Scan Barcode",
      hint: "Point the camera at the barcode",
      permissionDenied: "Camera access denied",
    },
    activation: {
      subtitle: "Please activate the app to continue",
      step1: "Scan the QR code to activate",
      step2: "Enter the password",
      scanHint: "Point the camera at the QR code above",
      startScan: "Start Scanning",
      passwordPlaceholder: "Password",
      button: "Activate",
      back: "Back",
      qrVerified: "QR code verified",
      qrInvalid: "Invalid QR code",
      success: "App activated successfully",
      invalid: "Incorrect password",
    },
    inventory: {
      addProduct: "Add Product",
      editProduct: "Edit Product",
      search: "Search products...",
      allCategories: "All Categories",
      sortName: "Name",
      sortPrice: "Price",
      sortQty: "Quantity",
      asc: "Ascending",
      desc: "Descending",
      empty: "Inventory is empty",
      emptyHint: "Start by adding your products",
      noResults: "No results found",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      stats: {
        products: "Products",
        units: "Units",
        value: "Value",
        lowStock: "Low Stock",
      },
    },
    form: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      deleted: "Deleted",
      saved: "Saved",
      required: "This field is required",
      name: "Product Name",
      category: "Category",
      color: "Color",
      size: "Size",
      quantity: "Quantity",
      purchasePrice: "Purchase Price",
      salePrice: "Sale Price",
      lowStockThreshold: "Low Stock Threshold",
      barcode: "Barcode",
      scan: "Scan",
      generate: "Generate",
      image: "Image",
      pickImage: "Pick Image",
      changeImage: "Change Image",
      printBarcode: "Print Barcode",
      confirmDelete: "Do you want to delete this product?",
    },
    pos: {
      title: "Point of Sale",
      search: "Search or scan barcode...",
      notFound: "Product not found",
      cart: "Cart",
      emptyCart: "Cart is empty",
      emptyHint: "Search for a product to add",
      qty: "Qty",
      price: "Price",
      lineTotal: "Total",
      subtotal: "Subtotal",
      discount: "Discount",
      total: "Total",
      paymentMethod: "Payment Method",
      cash: "Cash",
      card: "Card",
      other: "Other",
      customerName: "Customer Name",
      pay: "Complete Sale",
      saleSuccess: "Sale completed successfully",
      stockWarning: "Requested quantity exceeds stock",
      invoice: "Invoice",
      invoiceNo: "Invoice No.",
      date: "Date",
      item: "Item",
      printInvoice: "Print Invoice",
      thanks: "Thank you for shopping with us",
    },
    reports: {
      title: "Reports",
      today: "Today",
      week: "Week",
      month: "Month",
      year: "Year",
      revenue: "Revenue",
      profit: "Profit",
      salesCount: "Sales Count",
      avgSale: "Average Sale",
      topProducts: "Top Products",
      recentSales: "Recent Sales",
      units: "unit",
      noSales: "No sales",
      chartSales: "Sales",
    },
    settings: {
      title: "Settings",
      language: "Language",
      currency: "Currency",
      exchangeRate: "Exchange Rate (1€ = DZD)",
      theme: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      store: "Store Information",
      storeName: "Store Name",
      storePhone: "Phone Number",
      storeAddress: "Address",
      saved: "Settings saved successfully",
      backup: "Backup",
      export: "Export Data",
      import: "Import Data",
      exported: "Backup exported successfully",
      imported: "Data imported successfully",
      importError: "Import failed, check the file",
    },
  },
};

export type { Translation as TranslationType };
