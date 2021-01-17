variable "project_id" {
  default = "todo-er"
}

variable "zone" {
  default = "europe-west1-d"
}

variable "region" {
  default = "europe-west1"
}

resource "google_compute_network" "mbti-net" {
  project                 = var.project_id
  name                    = "mbti-net"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "mbti-subnet" {
  project       = var.project_id
  name          = "mbti-subnet"
  region        = var.region
  network       = google_compute_network.mbti-net.self_link
  ip_cidr_range = "10.30.0.0/16"
}

resource "google_compute_firewall" "mbti-firewall" {
  project       = var.project_id
  name          = "mbti-firewall"
  network       = google_compute_network.mbti-net.self_link
  target_tags   = ["mbti-server"]
  source_ranges = ["0.0.0.0/0"]
  allow {
    protocol = "icmp"
  }
  allow {
    protocol = "tcp"
    ports    = ["22", "80", "8080", "3001-3005"]
  }
}

resource "google_compute_instance" "mbti-server" {
  project      = var.project_id
  name         = "mbti-server"
  zone         = var.zone
  machine_type = "n1-standard-1"
  tags         = ["mbti-server"]
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }
  network_interface {
    network    = google_compute_network.mbti-net.self_link
    subnetwork = google_compute_subnetwork.mbti-subnet.self_link
    access_config {

    }
  }
  metadata_startup_script = file("./startup.sh")
}

output "external_ip" {
  value = google_compute_instance.mbti-server.network_interface.0.access_config.0.nat_ip
}
