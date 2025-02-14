{
	description = "Desktop widget with Astal/AGS";

	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
		ags.url = "github:aylur/ags";
	};

	outputs = { self, nixpkgs, ags }: let
		system = "x86_64-linux";
		pkgs = nixpkgs.legacyPackages.${system};
		astalExtraPackages = [
			ags.packages.${system}.notifd
			ags.packages.${system}.network
			ags.packages.${system}.wireplumber
			ags.packages.${system}.mpris
			ags.packages.${system}.tray
			ags.packages.${system}.hyprland
		];
	in {
		packages.${system}.default = ags.lib.bundle { 
		  inherit pkgs;
		  src = ./.;
		  name = "dotags"; # name of executable
		  entry = "app.ts";
		  gtk4 = false;

		  # additional libraries and executables to add to gjs' runtime
		  extraPackages = astalExtraPackages;
		};
		devShells.${system}.default = pkgs.mkShell {
			buildInputs = [
				(ags.packages.${system}.default.override {
					extraPackages = astalExtraPackages;
				})
			];
		};
	};
}

