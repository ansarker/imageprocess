import argparse
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import os
from decode_segmap import decode_segmap
import sys


if __name__ == "__main__":
    """
        Argument:
    """
    parser = argparse.ArgumentParser(description="Add Inputs")
    parser.add_argument("--image_path", type=str, help="Path: input image dir")
    parser.add_argument("--num_classes", type=int, help="Number of classes")
    # parser.add_argument('--label_colors', type=list, nargs='+', help='Color labels: array or each classes rgb values')
    parser.add_argument(
        "--label_colors",
        type=str,
        help="Color labels: array or each classes rgb values",
    )
    args = parser.parse_args()

    image_path = args.image_path
    num_classes = args.num_classes
    label_colors = args.label_colors.split(",")
    label_colors = np.array(label_colors)
    label_colors = np.array(label_colors.reshape(num_classes, 3))

    # print('path ', image_path)
    # print('num_classes ', num_classes)
    # print('colors ', label_colors)
    # sys.stdout.flush()

    ind = 0
    for img_name in os.listdir(image_path):
        if ind > -1:
            print(f'Current Image: {img_name.rstrip(".png")}')

            """
                Read images as PIL Image and convert it to numpy array
            """
            image = np.asarray(Image.open(os.path.join(image_path, img_name)))
            # image = image[:, :, 0]
            output = decode_segmap(
                image=image, nc=num_classes, label_colors=label_colors
            )
            # plt.imshow(output)
            plt.imsave(
                "/run/media/anis/Data/DeskSoft/index-image/output/" + img_name, output
            )
        else:
            pass
        ind += 1
