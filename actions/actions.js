"usenpm server";
//import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/app/utils/authOptions"

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const fetchBlogs = async () => {
  const blogs = await prisma.blog.findMany({});
  return blogs;
};

export const fetchSingleBlog = async (id) => {
  const blogs = await prisma.blog.findFirst({
    where: {
      id: id,
    },
  });
  return blogs;
};

export const fetchSingleCourse = async (id) => {
  const courses = await prisma.cards.findFirst({
    where: {
      id: id
    },
    include: {
      categoria: true,
      courseInfo: true,
      contentCourse: true,
      teachers: {
        include: {
          teacher: true
        },
      },
      coordinators: {
        include: {
          coordinator: true, 
        },
      },
    },
  });
  return courses;
}

export const fetchSingleTeacher = async (id) => {
  const teacher = await prisma.teachers.findFirst({
    where: {
      id: id,
    },
  });
  return teacher;
};

export const fetchSingleCoordinator = async (id) => {
  const coordinator = await prisma.coordinators.findFirst({
    where: {
      id: id,
    },
  });
  return coordinator;
};

export const fetchSingleInfoSite = async (id) => {
  const info = await prisma.infoSite.findFirst({
    where: {
      id: id
    },
  });
  return info;
}


export const fetchSingleInfoCourse = async (id) => {
  const content = await prisma.infoCourse.findFirst({
    where: {
      id: id
    },
  });
  return content;
}


export const fetchSingleMenu = async (id) => {
  const menu = await prisma.menuItems.findFirst({
    where: {
      id: id
    },
    include: {
      category: {
        select: {
          NomeCat: true,
        }
      }
    }
  });
  return menu;
}

export const fetchSingleDeposition = async (id) => {
  const info = await prisma.depoimento.findFirst({
    where: {
      id: id
    },
  });
  return info;
}

export const fetchSingleCategory = async (id) => {
  const category = await prisma.catCurso.findFirst({
     where: {
      id: id
     },
  });
  return category; 
}

export const addBlog = async (formData) => {
  // collect info from form using formData
  const imageUrl = formData.get("imageUrl");
  const title = formData.get("title");
  const category = formData.get("category");
  const description = formData.get("description");

  // session to get the current logged in user info

  const session = await getServerSession(authOptions);

  // only admin can add blog
  if (
    session?.user?.role === "ADMIN" ||
    session?.user?.permissions?.includes("CREATE_BLOG")
  ) {
    // push the data into the DB
    const new_blog = await prisma.blog.create({
      data: {
        imageUrl: imageUrl ? imageUrl : null,
        title,
        category,
        description,
        authorId: session?.user?.id,
      },
    });

    revalidatePath("/blogs/add-blog");
    redirect("/blogs");
  }
};

// Update a Blog

export const updateBlog = async (id, formData) => {
  // collect info from form using formData
  const imageUrl = formData.get("imageUrl");
  const title = formData.get("title");
  const category = formData.get("category");
  const description = formData.get("description");

  // session

  const session = await getServerSession(authOptions);

  // only admin can add blog
  if (
    session?.user?.role === "ADMIN" ||
    session?.user?.permissions?.includes("EDIT_BLOG")
  ) {
    // push the data into the DB
    const updated_blog = await prisma.blog.update({
      where: {
        id: id,
      },
      data: {
        imageUrl: imageUrl ? imageUrl : null,
        title,
        category,
        description,
        authorId: session?.user?.id,
      },
    });

    revalidatePath(`/blogs/update-blog/${id}`);
    redirect("/blogs");
  } else {
    console.log("Not Possible!");
  }
};

// add Comment to a blog
export const addCommentToBlog = async (blogId, formData) => {
  // collect info from form using formData
  const text = formData.get("text");

  // session

  const session = await getServerSession(authOptions);

  // push the data into the DB
  const added_comment = await prisma.comment.create({
    data: {
      authorId: session?.user?.id,
      blogId: blogId,
      text: text,
    },
  });
  revalidatePath(`/blogs/${blogId}`);
  redirect(`/blogs/${blogId}`);
};

// fetching all comments
export const fetchComments = async (blogId) => {
  //const skip = (page - 1) * pageSize

  const comments = await prisma.comment.findMany({
    where: {
      blogId: blogId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // pagination
  });

  return comments;
};

// delete Comment by Id and blogId
export const deleteComment = async (commentId, blogId) => {
  // only auther of this comment can delete it!

  const session = await getServerSession(authOptions);

  // comment of autherId

  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
  });

  if (session?.user?.id === commentData?.authorId) {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    revalidatePath(`/blogs/${blogId}`);
  } else {
    console.log("You Are Not Authorize to Delete This Comment!");
  }
};

// fetch users
export const fetchUsers = async () => {
  const users = await prisma.user.findMany({
    take: 5,
  });

  return users;
};

// assign user to a particular role from admin panel
export const assignPermission = async (userId, formData) => {
  const permission_name = formData.get("permission_name");

  // session
  const session = await getServerSession(authOptions);

  // only admin can add blog
  if (session?.user?.role === "ADMIN") {
    // asssign some permission to user by admin
    const assigned_user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        permissions: {
          push: permission_name,
        },
      },
    });
    revalidatePath(`/admin/dashboard`);
    redirect(`/admin/dashboard`);
  }
};

// fetch All Blogs tags
export const fetchAllTags = async () => {
  const blogs = await prisma.blog.findMany({
    select: {
      tags: true,
    },
  });
  const alltags = [...new Set(blogs.flatMap((blog) => blog.tags))];
  return alltags;
};

export const fetchPreferedBlogs = async () => {
  const session = await getServerSession(authOptions);

  // fetch user preferences topics

  let currentUser = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    select: {
      interestedTopics: true,
    },
  });

  let topics = currentUser?.interestedTopics || [];

  // now find all the matching blogs based on its tags and user preferences topic

  const blogs = await prisma.blog.findMany({
    where: {
      tags: {
        hasSome: topics,
      },
    },
  });

  return blogs;
};

export const fetchCategory = async () => {
  const categories = await prisma.catCurso.findMany({});
  return categories;
};

export const fetchInfoCourse = async () => {
  const infoCourse = await prisma.infoCourse.findMany({});
  return infoCourse;
}

export const fetchTeachers = async () => {
  const teachers = await prisma.teachers.findMany({});
  return teachers;
}

export const fetchCoordinators = async () => {
  const coordinators = await prisma.coordinators.findMany({});
  return coordinators;
}
export const fetchCardsByCategory = async (category) => {
  
  
  const decodedCategory = decodeURIComponent(category).trim().toLowerCase();
  const query = decodedCategory ? { categoria: { NomeCat: { equals: decodedCategory, mode: 'insensitive'} } } : {}; 
  const cards = await prisma.cards.findMany({
    include: { categoria: true },
    where: query,
  });

  const categoriesData = await prisma.catCurso.findMany({});

  const groupedCards = {};

  categoriesData.forEach((cat) => {
    const cleanedCategoryName = cat.NomeCat.replace(/\s+/g, ' ').trim().toLowerCase();
    groupedCards[cleanedCategoryName] = [];
  });

  cards.forEach((card) => {
    const categoryName = card.categoria?.NomeCat.replace(/\s+/g, ' ').trim().toLowerCase() || 'sem categoria';
    if (groupedCards[categoryName]) {
      groupedCards[categoryName].push(card);
    }
  });

  return groupedCards;
}

