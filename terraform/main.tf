# comment
provider "aws" {
  region = "eu-central-1"
}

resource "aws_dynamodb_table" "sensor_data" {
  name = "sensor_data"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "room_id"
  range_key = "timestamp"

  attribute {
    name = "room_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  tags = {
    Name = "sensor_data"
    Environment = "dev"
  }
}