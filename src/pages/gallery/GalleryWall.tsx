import { useNavigate } from "react-router-dom";
import { GALLERY_WALLS } from "../../db/galleryData";
import type { GalleryWallTemplate } from "../../types/interfaces/gallery.interface";

const GalleryWall: React.FC = () => {
	const navigate = useNavigate();

	const handleSelectWall = (wall: GalleryWallTemplate) => {
		navigate("/gallery-wall/upload", { state: { selectedWall: wall } });
	};

	return (
		<>
			<div className="mb-8">
				<p className="text-gray-600">
					Choose a gallery wall layout to get started
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{GALLERY_WALLS.map((wall) => (
					<button
						key={wall.id}
						onClick={() => handleSelectWall(wall)}
						className="bg-white rounded-lg border-2 border-gray-200 hover:border-primary transition-all overflow-hidden group"
					>
						<div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
							<img
								loading="lazy"
								src={wall.image}
								alt={wall.name}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							/>
						</div>
						<div className="p-4">
							<h3 className="font-semibold text-gray-900 mb-1">{wall.name}</h3>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-600">{wall.dimensions}</span>
								<span className="text-primary font-bold">${wall.price}</span>
							</div>
						</div>
					</button>
				))}
			</div>
		</>
	);
};
export default GalleryWall;
