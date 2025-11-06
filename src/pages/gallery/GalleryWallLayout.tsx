import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb";
import { GALLERY_WALL_STEPS } from "../../constants/galleryBreadcrumbSteps";

const GalleryWallLayout: React.FC = () => {
	const location = useLocation();
	const isUpload = location.pathname.includes("/upload");
	const currentStep = isUpload ? "upload" : "select";

	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto">
				<Breadcrumb steps={GALLERY_WALL_STEPS} currentStepId={currentStep} />
				<Outlet />
			</div>
		</div>
	);
};

export default GalleryWallLayout;
