import SpaceCard from "./SpaceCard";

export default function SpaceGrid({ spaces }) {

    return (
        <section className="mx-auto max-w-7xl py-12">

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {spaces.map((space) => (
                    <SpaceCard
                        key={space.id}
                        space={space}
                    />
                ))}

            </div>

        </section>
    );
}