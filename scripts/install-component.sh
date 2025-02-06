#!/bin/bash

# Color codes for better formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Error handling function
handle_error() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    exit 1
}

# Check for required tools
check_dependencies() {
    # Check for package.json
    if [ ! -f "./package.json" ]; then
        handle_error "No package.json found. Are you in the correct project directory?"
    fi

    # Check for pnpm
    if ! command -v pnpm &>/dev/null; then
        handle_error "pnpm is not installed. Please install pnpm first."
    fi
}

# Trap ctrl-c and call ctrl_c()
trap ctrl_c INT

# Interrupt handler
ctrl_c() {
    echo -e "\n${YELLOW}[!] Installation interrupted by user.${NC}"
    echo -e "${RED}Cleaning up...${NC}"

    # Optionally add cleanup commands here if needed
    exit 130
}

# Clear the screen and display welcome message
clear
echo -e "${YELLOW}====================================================${NC}"
echo -e "${GREEN}Shadcn/UI Component Bulk Installation Script${NC}"
echo -e "${YELLOW}====================================================${NC}"

# Check dependencies before proceeding
check_dependencies

# Initialize confirm variable
confirm=""

# Confirmation prompt
while true; do
    read -p "Would you like to overwrite your current Shadcn/UI components? (yes/no): " confirm

    # Convert input to lowercase
    confirm=$(echo "$confirm" | tr '[:upper:]' '[:lower:]')

    case "$confirm" in
    yes | y)
        confirm="y"
        echo -e "${GREEN}✓ Installation confirmed. Proceeding...${NC}"
        break
        ;;
    no | n)
        confirm="N"
        echo -e "${GREEN}✓ Installation confirmed. Proceeding...${NC}"
        break
        ;;
    *)
        echo -e "${YELLOW}✗ Invalid input. Please answer 'yes' or 'no'.${NC}"
        ;;
    esac
done

# Function to draw progress bar
draw_progress_bar() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((width * current / total))
    local remaining=$((width - completed))

    printf "\r["
    printf "%*s" "$completed" | tr ' ' '='
    printf "%*s" "$remaining" | tr ' ' ' '
    printf "] %3d%% (%d/%d)" "$percentage" "$current" "$total"
}

# List of components
components=(
    "sidebar"
    "accordion"
    "alert"
    "alert-dialog"
    "aspect-ratio"
    "avatar"
    "breadcrumb"
    "badge"
    "button"
    "calendar"
    "card"
    "carousel"
    "chart"
    "checkbox"
    "collapsible"
    "command"
    "context-menu"
    "table"
    "dialog"
    "drawer"
    "dropdown-menu"
    "form"
    "hover-card"
    "input"
    "input-otp"
    "label"
    "menubar"
    "navigation-menu"
    "pagination"
    "popover"
    "progress"
    "radio-group"
    "resizable"
    "scroll-area"
    "select"
    "separator"
    "sheet"
    "skeleton"
    "slider"
    "sonner"
    "switch"
    "table"
    "tabs"
    "textarea"
    "toast"
    "toggle"
    "toggle-group"
    "tooltip"
)

# Total number of components
total_components=${#components[@]}

# Initialize progress and success tracking
current_component=0
failed_components=()
successful_components=()

# Log file for tracking installation
LOG_FILE=$(mktemp)
trap 'rm -f "$LOG_FILE"' EXIT

# Loop through each component and install it
for component in "${components[@]}"; do
    # Increment progress
    ((current_component++))

    # Draw progress bar
    draw_progress_bar "$current_component" "$total_components"

    sleep 0.1

    # Component-specific installations
    case "$component" in
    table)
        echo -e "\n Installing $component..."
        if (echo "$confirm" | pnpm dlx shadcn@latest add "$component" >"$LOG_FILE" 2>&1 &&
            pnpm add @tanstack/react-table >>"$LOG_FILE" 2>&1); then
            successful_components+=("$component")
            echo -e "${GREEN} ✓ $component installed!${NC}"
        else
            failed_components+=("$component")
            echo -e "${RED} ✗ Failed to install $component. Check log for details.${NC}"
        fi
        ;;
    calendar)
        echo -e "\n Installing $component..."
        if (echo "$confirm" | pnpm dlx shadcn@latest add "$component" >"$LOG_FILE" 2>&1 &&
            pnpm add react-day-picker >>"$LOG_FILE" 2>&1); then
            successful_components+=("$component")
            echo -e "${GREEN} ✓ $component installed!${NC}"
        else
            failed_components+=("$component")
            echo -e "${RED} ✗ Failed to install $component. Check log for details.${NC}"
        fi
        ;;
    *)
        echo -e "\n Installing $component..."
        if (echo "$confirm" | pnpm dlx shadcn@latest add "$component" >"$LOG_FILE" 2>&1); then
            successful_components+=("$component")
            echo -e "${GREEN} ✓ $component installed!${NC}"
        else
            failed_components+=("$component")
            echo -e "${RED} ✗ Failed to install $component. Check log for details.${NC}"
        fi
        ;;
    esac
done

# Final progress update
draw_progress_bar "$total_components" "$total_components"
echo -e "\n"

# Summary
echo -e "${GREEN}Installation Summary:${NC}"
echo -e "${GREEN}- Total Components: $total_components${NC}"
echo -e "${GREEN}- Successfully Installed: ${#successful_components[@]}${NC}"
echo -e "${GREEN}- Failed Components: ${#failed_components[@]}${NC}"

# List successful components
if [ ${#successful_components[@]} -gt 0 ]; then
    echo -e "\n${GREEN}Successful Installations:${NC}"
    for comp in "${successful_components[@]}"; do
        echo -e "${GREEN} - $comp${NC}"
    done
fi

# List failed components
if [ ${#failed_components[@]} -gt 0 ]; then
    echo -e "\n${RED}Failed Installations:${NC}"
    for comp in "${failed_components[@]}"; do
        echo -e "${RED} - $comp${NC}"
    done
    echo -e "\n${YELLOW}Check the temporary log file for details: $LOG_FILE${NC}"
    exit 1
fi

echo -e "\n${GREEN}✓ All components installed successfully!${NC}"
