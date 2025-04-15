# WhatsApp Interface

Una interfaz web para visualizar conversaciones de WhatsApp almacenadas en Supabase, con un diseño similar a WhatsApp Web.

## Características

- 🎨 Diseño similar a WhatsApp Web
- 🌓 Modo oscuro/claro
- 🔄 Actualización en tiempo real
- 🔍 Búsqueda de conversaciones
- 📱 Diseño responsive
- 🤖 Identificación de mensajes de bot/usuario
- ⏱️ Ordenamiento por último mensaje

## Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- Lucide Icons

## Requisitos

- Node.js 18 o superior
- npm o yarn
- Una cuenta en Supabase

## Configuración

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd whatsapp-interface
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` con las siguientes variables:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

4. Configura la base de datos en Supabase:

```sql
-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create conversations table
CREATE TABLE public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR NOT NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    contact_name VARCHAR
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR NOT NULL,
    sender_type VARCHAR NOT NULL CHECK (sender_type IN ('user', 'bot', 'agent')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    conversation_id UUID REFERENCES public.conversations(id),
    message_status VARCHAR,
    media_url TEXT,
    message_type VARCHAR,
    metadata JSONB
);

-- Create indexes
CREATE INDEX idx_conversations_phone_number ON public.conversations(phone_number);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.conversations
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.messages
    FOR SELECT USING (true);
```

## Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Despliegue

La aplicación puede ser desplegada en Vercel siguiendo estos pasos:

1. Crea una cuenta en Vercel si aún no tienes una
2. Conecta tu repositorio de GitHub
3. Importa el proyecto
4. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Despliega

## Estructura del Proyecto

```
src/
  ├── app/              # Páginas de la aplicación
  ├── components/       # Componentes reutilizables
  ├── lib/             # Utilidades y configuración
  └── types/           # Definiciones de TypeScript
```

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
