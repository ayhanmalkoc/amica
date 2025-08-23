# 🏗️ Amica Development Guidelines Document (DGD)

## 📋 **Belge Amacı**
Bu belge, Amica projesinde tutarlı ve kaliteli kod geliştirmek için gerekli mimari kuralları, kalıpları ve en iyi uygulamaları tanımlar. Herhangi bir özellik geliştirme, düzenleme veya yeni ekleme işleminde bu kurallara uyulması zorunludur.

---

## 🎯 **Temel Mimari Prensipleri**

### **1. Modüler Mimari**
```typescript
// ✅ DOĞRU: Modüler yapı
src/features/openaiWhisper/
├── openaiWhisper.ts      # Ana özellik logic
├── types.ts              # Özellik-spesifik tipler
└── utils.ts              # Özellik yardımcıları

// ❌ YANLIŞ: Tek dosyada her şey
src/allInOne.ts
```

### **2. Separation of Concerns**
- **Components**: Sadece UI render logic
- **Features**: İş mantığı ve API çağrıları  
- **Utils**: Genel amaçlı yardımcı fonksiyonlar
- **Types**: TypeScript tip tanımları

---

## 🔧 **Settings & Configuration Architecture**

### **ZORUNLU PATTERN: Settings Component Integration**

Her yeni ayar sayfası aşağıdaki mimariyi takip ETMELİDİR:

#### **1. State Management Pattern**
```typescript
// settings.tsx içinde ZORUNLU pattern:
const [featureName, setFeatureName] = useState<Type>(defaultValue);
const [featureOption, setFeatureOption] = useState<Type>(defaultValue);

// useEffect içinde ZORUNLU ekleme:
useEffect(() => {
  if (settingsUpdated) {
    // Bildirim sistemi
    toast.success(t("Settings updated"));
    setSettingsUpdated(false);
  }
}, [
  // ...existing dependencies...
  featureName,      // YENİ state eklenmeli
  featureOption,    // YENİ state eklenmeli
  settingsUpdated, 
  t
]);
```

#### **2. Settings Page Component Pattern**
```typescript
// ✅ ZORUNLU: Props ile state yönetimi
export default function FeatureSettingsPage({
  featureName,
  setFeatureName,
  featureOption, 
  setFeatureOption,
  setSettingsUpdated,
}: {
  featureName: Type;
  setFeatureName: (value: Type) => void;
  featureOption: Type;
  setFeatureOption: (value: Type) => void;
  setSettingsUpdated: (value: boolean) => void;
}) {
  // ✅ ZORUNLU: BasicPage kullanımı
  return (
    <BasicPage
      title={t("Feature_Settings")}
      description={t("Configure feature settings")}
    >
      {/* ✅ ZORUNLU: FormRow kullanımı */}
      <FormRow label={t("Feature_Option")}>
        <select
          value={featureName}
          onChange={(e) => {
            setFeatureName(e.target.value);
            updateConfig({ featureName: e.target.value });
            setSettingsUpdated(true); // ✅ ZORUNLU
          }}
        >
          {/* options */}
        </select>
      </FormRow>
    </BasicPage>
  );
}

// ❌ YANLIŞ: Local state kullanımı
const [localState, setLocalState] = useState(); // YASAK
```

#### **3. Config Integration Pattern**
```typescript
// ✅ ZORUNLU: Her değişiklikte config güncelleme
onChange={(value) => {
  setStateName(value);
  updateConfig({ configKey: value });    // ZORUNLU
  setSettingsUpdated(true);             // ZORUNLU
}}
```

---

## 🌐 **i18n (Internationalization) Architecture**

### **ZORUNLU PATTERN: Çeviri Sistemi**

#### **1. Çeviri Key Yapısı**
```typescript
// ✅ DOĞRU: Hierarchical key structure
{
  "Feature_Settings": "Feature Settings",
  "Feature_Auto_Detection": "Auto Detection", 
  "Feature_Manual_Selection": "Manual Selection",
  "Feature_Help_Description": "Configure feature settings"
}

// ❌ YANLIŞ: Flat structure
{
  "feature1": "text",
  "feature2": "text"
}
```

#### **2. Desteklenen Diller (ZORUNLU)**
Yeni çeviriler aşağıdaki dillere EKLENMELİDİR:
- `tr` - Türkçe (Ana dil)
- `en` - English (Varsayılan) 
- `zh` - 中文 (Chinese)
- `de` - Deutsch (German)
- `es` - Español (Spanish)
- `ka` - ქართული (Georgian)

#### **3. Çeviri Ekleme Pattern**
```typescript
// ✅ ZORUNLU: Tüm dillere aynı anda ekleme
// tr/common.json
"New_Feature": "Yeni Özellik"

// en/common.json  
"New_Feature": "New Feature"

// zh/common.json
"New_Feature": "新功能"

// Diğer diller...
```

---

## 🎭 **Component Architecture**

### **1. React Component Pattern**
```typescript
// ✅ DOĞRU: Functional component with TypeScript
interface Props {
  prop1: Type;
  prop2: Type;
}

export default function ComponentName({ prop1, prop2 }: Props) {
  return (
    <div>
      {/* content */}
    </div>
  );
}

// ❌ YANLIŞ: Class component veya any type
export class ComponentName extends React.Component<any, any> // YASAK
```

### **2. Import/Export Pattern**
```typescript
// ✅ DOĞRU: Named exports utilities için
export const utilityFunction = () => { ... };
export const anotherUtility = () => { ... };

// ✅ DOĞRU: Default export components için
export default function ComponentName() { ... }
```

---

## 🔌 **Feature Development Architecture**

### **1. Feature Klasör Yapısı**
```typescript
// ✅ ZORUNLU: Feature klasör organizasyonu
src/features/featureName/
├── featureName.ts        # Ana logic
├── types.ts              # Feature types
├── utils.ts              # Feature utilities  
└── index.ts              # Exports
```

### **2. Feature Integration Pattern**
```typescript
// ✅ DOĞRU: Feature entegrasyonu
// features/featureName/featureName.ts
export class FeatureName {
  async processData(input: InputType): Promise<OutputType> {
    // Implementation
  }
}

// Kullanım:
import { FeatureName } from '@/features/featureName';
```

---

## 🛠️ **Utils Architecture**

### **1. Utility Function Pattern**
```typescript
// ✅ DOĞRU: Pure functions
export const utilityFunction = (input: Type): ReturnType => {
  // Stateless logic
  return result;
};

// ❌ YANLIŞ: Side effects
export const badUtility = (input: Type) => {
  // Global state mutation YASAK
  globalVariable = input;
};
```

### **2. Config Utilities Pattern**
```typescript
// ✅ ZORUNLU: Config pattern
export const updateConfig = (newConfig: Partial<Config>) => {
  const currentConfig = getConfig();
  const updatedConfig = { ...currentConfig, ...newConfig };
  saveConfig(updatedConfig);
};
```

---

## 📁 **File Naming Conventions**

### **1. Dosya İsimlendirme**
```typescript
// ✅ DOĞRU:
ComponentName.tsx         # React components
utilityName.ts           # Utility functions  
featureName.ts           # Feature logic
types.ts                 # Type definitions

// ❌ YANLIŞ:
component-name.tsx       # kebab-case YASAK
COMPONENT_NAME.tsx       # UPPER_CASE YASAK
component.js             # .js extension YASAK
```

### **2. Değişken İsimlendirme**
```typescript
// ✅ DOĞRU:
const userName = "...";           # camelCase
const API_ENDPOINT = "...";       # UPPER_CASE constants
interface UserData { ... }        # PascalCase interfaces

// ❌ YANLIŞ:
const user_name = "...";          # snake_case YASAK
const UserName = "...";           # PascalCase variables YASAK
```

---

## 🔍 **Type Safety Rules**

### **1. TypeScript ZORUNLU Kuralları**
```typescript
// ✅ DOĞRU: Explicit typing
interface ConfigType {
  setting1: string;
  setting2: boolean;
}

const config: ConfigType = { ... };

// ❌ YANLIŞ: Any type usage
const config: any = { ... };      # any YASAK
const config = { ... } as any;    # any assertion YASAK
```

### **2. Props Interface Pattern**
```typescript
// ✅ DOĞRU: Interface definition
interface ComponentProps {
  title: string;
  isVisible: boolean;
  onAction: () => void;
}

export default function Component({ title, isVisible, onAction }: ComponentProps) {
  // Implementation
}
```

---

## 🧪 **Testing Architecture (Gelecek için Hazırlık)**

### **1. Test File Pattern**
```typescript
// ✅ DOĞRU: Test file structure
src/components/ComponentName.test.tsx
src/utils/utilityName.test.ts
src/features/featureName/featureName.test.ts
```

---

## 🚫 **YASAKLAR ve KAÇINILMASI GEREKENLER**

### **1. Kod Yasakları**
```typescript
// ❌ YASAK: Global state mutations
window.globalVariable = value;

// ❌ YASAK: Direct DOM manipulation
document.getElementById('element').innerHTML = '';

// ❌ YASAK: Any type usage
const data: any = {};

// ❌ YASAK: Local state in settings components
const [localSetting, setLocalSetting] = useState();

// ❌ YASAK: Inline styles (CSS-in-JS hariç)
<div style={{ color: 'red' }}>
```

### **2. Mimari Yasakları**
```typescript
// ❌ YASAK: Component içinde business logic
export default function Component() {
  const complexBusinessLogic = () => {
    // Bu logic features/ klasöründe olmalı
  };
}

// ❌ YASAK: Cross-feature imports
import { FeatureA } from '@/features/featureB/featureA'; // YASAK
```

---

## ✅ **KONTROL LİSTESİ: Yeni Özellik Eklerken**

### **Geliştirme Öncesi Kontroller:**
- [ ] Özellik existing architecture'a uyuyor mu?
- [ ] Benzer pattern mevcut mu? (Kopyala-yapıştır-uyarla)
- [ ] i18n çevirileri planlandı mı?
- [ ] TypeScript tipleri tanımlandı mı?

### **Geliştirme Sırası Kontroller:**
- [ ] Settings component integration pattern uygulandı mı?
- [ ] Tüm dillere çeviri eklendi mi?
- [ ] updateConfig() ve setSettingsUpdated() kullanıldı mı?
- [ ] BasicPage ve FormRow components kullanıldı mı?
- [ ] TypeScript strict mode uyumlu mu?

### **Geliştirme Sonrası Kontroller:**
- [ ] Build başarılı mı? (`npm run build`)
- [ ] TypeScript hatası var mı?
- [ ] i18n keys tüm dillerde mevcut mu?
- [ ] Settings kaydediliyor mu?
- [ ] Component render ediliyor mu?

---

## 🎯 **SONUÇ ve UYGULAMA**

Bu belge Amica projesinin **ana mimari rehberi**dir. Herhangi bir geliştirme işlemi yaparken:

1. **Bu belgeyi REHBERİNİZ yapın**
2. **Mevcut patterns'i KOPYALAYIN** (sıfırdan yazmayın)
3. **Architecture uyumluluğunu KONTROL EDİN**
4. **Tüm dilleri DESTEKLEYIN**
5. **TypeScript strict mode'u KORUYUN**

**Bu kurallar ZORUNLUDUR ve istisnası yoktur.**

---

## 📞 **İletişim**

Bu belge ile ilgili sorular için proje maintainer'ları ile iletişime geçin.

**Son Güncellenme:** Aralık 2024
**Belge Versiyonu:** 1.0.0
