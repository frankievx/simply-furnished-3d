export default function ProductPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute pointer-events-none py-auto px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent">
        <div className="flex flex-col gap-16 items-center justify-center h-full">
          <h1 className="font-casanova italic text-4xl sm:text-7xl ">
            Product
          </h1>
        </div>
      </div>
    </main>
  );
}
