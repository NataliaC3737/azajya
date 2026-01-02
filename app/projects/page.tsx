import Image from "next/image";

// 1. Tipado exacto según tu JSON de la API
interface ImagenFormat {
  url: string;
  width: number;
  height: number;
}

interface Imagen {
  id: number;
  url: string;
  name: string;
  formats: {
    medium?: ImagenFormat;
    small?: ImagenFormat;
    thumbnail?: ImagenFormat;
  };
}

interface IProject {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  fecha_finalizacion: string;
  imagenes: Imagen[];
}

async function getProyectos(): Promise<IProject[]> {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects?populate=*`;

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  // Strapi suele devolver { data: [...] }
  return json.data;
}

export default async function ProyectosPage() {
  const proyectos = await getProyectos();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nuestros Proyectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proyectos?.map((proyecto) => {
          // Extraemos la URL de la primera imagen si existe
          // Priorizamos el formato 'medium' para rendimiento, si no la original
          const imagenPrincipal = proyecto.imagenes?.[0];
          const imageUrl =
            imagenPrincipal?.formats?.medium?.url || imagenPrincipal?.url;

          return (
            <div
              key={proyecto.documentId}
              className="border rounded-lg p-4 shadow-sm"
            >
              {imageUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={imageUrl}
                    alt={proyecto.titulo}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <h2 className="text-xl mt-4 font-semibold">{proyecto.titulo}</h2>
              <p className="text-gray-600">{proyecto.descripcion}</p>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm mb-2">
                  Duración: {proyecto.duracion}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Finalizado el {proyecto.fecha_finalizacion}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
