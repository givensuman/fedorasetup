#!/bin/bash

# -----------------------------------

# Maximize download speed for updates
sudo sed -i 's/max_parallel_downloads=.*/max_parallel_downloads=10/' /etc/dnf/dnf.conf

# Check for system updates and upgrade if available
sudo dnf check-update > /dev/null
if [[ $(dnf list updates | grep -v -e "^$" | wc -l) -gt 0 ]]; then
  sudo dnf upgrade -y
fi

# Install additional software packages
sudo dnf install -y htop vim git

# Install RPM Fusion Software Repositories
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

# Update application data
sudo dnf groupupdate core

# Install extra sound and video packages
sudo dnf groupupdate multimedia --setop="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin
sudo dnf groupupdate sound-and-video

# Install extra drivers and libraries
sudo dnf install rpmfusion-free-release-tainted
sudo dnf install libdvdcss

# Install extra firmware utilities
sudo dnf install rpmfusion-nonfree-release-tainted
sudo dnf install \*-firmware

# Install Flathub Flatpak Repositories
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak remote-add --if-not-exists flathub-beta https://flathub.org/beta-repo/flathub-beta.flatpakrepo

# Install customization software
sudo dnf install gnome-tweaks
sudo dnf install gnome-shell-extension-manager

# Copy dotfiles
rsync --recursive --update --delete ./dotfiles/.local/ ~/.local/
cp -f ./dotfiles/.bashrc ~/
cp -f ./dotfiles/.gitconfig ~/
rsync --recursive --update --delete ./dotfiles/.mozilla/ ~/.mozilla/
rsync --recursive --update --delete ./dotfiles/.vscode/ ~/.vscode/

# Copy pictures
rsync --recursive --update --delete ./pictures/ ~/Pictures

# Change fonts
gsettings set org.gnome.desktop.interface monospace-font-name 'SF Mono Regular 13'
gsettings set org.gnome.desktop.interface font-name 'SF Pro Display Regular 13'
gsettings set org.gnome.desktop.wm.preferences titlebar-font 'SF Pro Display Bold 13'

# Change cursor, icons, sounds
gsettings set org.gnome.desktop.sound theme-name "MacOS"
gsettings set org.gnome.desktop.interface cursor-theme "Bibata"
gsettings set org.gnome.desktop.interface icon-theme "Colloid"

# Change wallpaper
wallpaper_path="~/Pictures/mountains.jpg"
gsettings set org.gnome.desktop.background picture-uri "file://$wallpaper_path"
gsettings set org.gnome.desktop.background picture-uri "file:///$wallpaper_path"
gsettings set org.gnome.desktop.screensaver picture-uri "file:///$wallpaper_path"

# Change profile picture
new_profile_picture="~/Pictures/hamster.jpg"
gnome_user_accounts_dir="/var/lib/AccountsService/users"
current_user=$(whoami)
user_account_file="$gnome_user_accounts_dir/$current_user"

if [ ! -f "$user_account_file" ]; then
    echo "Error: user account file not found for $current_user"
    exit 1
fi

sed -i "s|^Icon=.*|Icon=$new_profile_picture|" $user_account_file
dbus-send --session --type=method_call --dest=org.gnome.Shell /org/gnome/Shell org.gnome.Shell.Eval "string:'Main.panel.statusArea.userMenu._accountItem.setGicon(new Gio.ThemedIcon({name: \"avatar-default\"}), \"org.gnome.Shell.AccountsService\"); Main.panel.statusArea.userMenu._accountItem.setGicon(new Gio.FileIcon({ file: Gio.File.new_for_path(\"$new_profile_picture\") }), \"org.gnome.Shell.AccountsService\");'"

# Enable maximize and minimize buttons
gsettings set org.gnome.desktop.wm.preferences button-layout ':minimize,maximize,close'

# Map keyboard shortcuts
gsettings set org.gnome.settings-daemon.plugins.media-keys home '<Super>f'
gsettings set org.gnome.settings-daemon.plugins.media-keys www '<Super>b'
gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-left "['<Shift><Super>Left']"
gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-right "['<Shift><Super>Right']"
gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-left "['<Control><Super>Left']"
gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-right "['<Control><Super>Right']"
gsettings set org.gnome.settings-daemon.plugins.media-keys terminal '<Super>t'
gsettings set org.gnome.settings-daemon.plugins.media-keys code '<Super>c'

# External script to make Firefox look like a GTK app
curl -s -o- https://raw.githubusercontent.com/rafaelmardojai/firefox-gnome-theme/master/scripts/install-by-curl.sh | bash

# Install extensions
EXTENSION_IDS=(615 5338 3193 517 97 307 1230 3843 19)

for id in "${EXTENSION_IDS[@]}"
do
    gnome-extensions install "$id"
    gnome-extensions enable "$id"
done

# -----------------------------------
echo "Setup complete."

gnome-session-quit --logout --no-prompt
