export const useAdminValidation = () => {
  const validateProject = (project) => {
    const errors = {};

    if (!project.name || project.name.trim().length < 2) {
      errors.name = 'Project name is required and must be at least 2 characters';
    }

    if (!project.description || project.description.trim().length < 10) {
      errors.description = 'Description is required and must be at least 10 characters';
    }

    if (!project.language || project.language.trim().length === 0) {
      errors.language = 'Programming language is required';
    }

    if (!project.html_url || !project.html_url.trim()) {
      errors.html_url = 'GitHub URL is required';
    } else if (!/^https?:\/\/github\.com\/.+/.test(project.html_url)) {
      errors.html_url = 'Please enter a valid GitHub URL';
    }

    if (project.homepage && project.homepage.trim() && !/^https?:\/\/.+/.test(project.homepage)) {
      errors.homepage = 'Please enter a valid URL for the demo link';
    }

    if (project.stargazers_count < 0) {
      errors.stargazers_count = 'Stars count cannot be negative';
    }

    return errors;
  };

  const validateTestimonial = (testimonial) => {
    const errors = {};

    if (!testimonial.name || testimonial.name.trim().length < 2) {
      errors.name = 'Name is required and must be at least 2 characters';
    }

    if (!testimonial.role || testimonial.role.trim().length < 2) {
      errors.role = 'Role is required and must be at least 2 characters';
    }

    if (!testimonial.message || testimonial.message.trim().length < 10) {
      errors.message = 'Message is required and must be at least 10 characters';
    }

    if (!testimonial.rating || testimonial.rating < 1 || testimonial.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    if (!testimonial.avatar || testimonial.avatar.trim().length === 0) {
      errors.avatar = 'Avatar emoji is required';
    }

    return errors;
  };

  const validateBlog = (blog) => {
    const errors = {};

    if (!blog.title || blog.title.trim().length < 3) {
      errors.title = 'Title is required and must be at least 3 characters';
    }

    if (!blog.content || blog.content.trim().length < 50) {
      errors.content = 'Content is required and must be at least 50 characters';
    }

    if (!blog.excerpt || blog.excerpt.trim().length < 10) {
      errors.excerpt = 'Excerpt is required and must be at least 10 characters';
    }

    if (!blog.author || blog.author.trim().length < 2) {
      errors.author = 'Author is required and must be at least 2 characters';
    }

    return errors;
  };

  const validateAbout = (about) => {
    const errors = {};

    if (!about.title || about.title.trim().length < 2) {
      errors.title = 'Title is required and must be at least 2 characters';
    }

    if (!about.description || about.description.trim().length < 10) {
      errors.description = 'Description is required and must be at least 10 characters';
    }

    if (!about.skills || !Array.isArray(about.skills) || about.skills.length === 0) {
      errors.skills = 'At least one skill is required';
    } else {
      about.skills.forEach((skill, index) => {
        if (!skill.name || skill.name.trim().length < 2) {
          errors[`skill_${index}_name`] = `Skill ${index + 1} name is required and must be at least 2 characters`;
        }
        if (!skill.level || skill.level < 1 || skill.level > 100) {
          errors[`skill_${index}_level`] = `Skill ${index + 1} level must be between 1 and 100`;
        }
      });
    }

    return errors;
  };

  const validateUser = (user) => {
    const errors = {};

    if (!user.username || user.username.trim().length < 2) {
      errors.username = 'Username is required and must be at least 2 characters';
    }

    if (!user.email || !user.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!user.role || !['admin', 'user'].includes(user.role)) {
      errors.role = 'Role must be either admin or user';
    }

    return errors;
  };

  const validateHome = (home) => {
    const errors = {};

    if (!home.hero?.heading || home.hero.heading.trim().length < 2) {
      errors.hero_heading = 'Hero heading is required and must be at least 2 characters';
    }

    if (!home.hero?.description || home.hero.description.trim().length < 10) {
      errors.hero_description = 'Hero description is required and must be at least 10 characters';
    }

    if (!home.hero?.buttons || !Array.isArray(home.hero.buttons) || home.hero.buttons.length === 0) {
      errors.hero_buttons = 'At least one hero button is required';
    } else {
      home.hero.buttons.forEach((button, index) => {
        if (!button.text || button.text.trim().length < 1) {
          errors[`hero_button_${index}_text`] = `Button ${index + 1} text is required`;
        }
        if (!button.link || button.link.trim().length < 1) {
          errors[`hero_button_${index}_link`] = `Button ${index + 1} link is required`;
        }
      });
    }

    if (!home.skills?.title || home.skills.title.trim().length < 2) {
      errors.skills_title = 'Skills title is required and must be at least 2 characters';
    }

    if (!home.skills?.skillsList || !Array.isArray(home.skills.skillsList) || home.skills.skillsList.length === 0) {
      errors.skills_list = 'At least one skill is required';
    } else {
      home.skills.skillsList.forEach((skill, index) => {
        if (!skill.name || skill.name.trim().length < 2) {
          errors[`skill_${index}_name`] = `Skill ${index + 1} name is required and must be at least 2 characters`;
        }
        if (!skill.level || skill.level < 1 || skill.level > 100) {
          errors[`skill_${index}_level`] = `Skill ${index + 1} level must be between 1 and 100`;
        }
      });
    }

    return errors;
  };

  const validateTimeline = (timeline) => {
    const errors = {};

    if (!timeline.type || !['work', 'education', 'certification'].includes(timeline.type)) {
      errors.type = 'Type must be work, education, or certification';
    }

    if (!timeline.title || timeline.title.trim().length < 2) {
      errors.title = 'Title is required and must be at least 2 characters';
    }

    if (!timeline.company || timeline.company.trim().length < 2) {
      errors.company = 'Company/Organization is required and must be at least 2 characters';
    }

    if (!timeline.location || timeline.location.trim().length < 2) {
      errors.location = 'Location is required and must be at least 2 characters';
    }

    if (!timeline.period || timeline.period.trim().length < 2) {
      errors.period = 'Period is required and must be at least 2 characters';
    }

    if (!timeline.description || timeline.description.trim().length < 10) {
      errors.description = 'Description is required and must be at least 10 characters';
    }

    if (!timeline.technologies || !Array.isArray(timeline.technologies) || timeline.technologies.length === 0) {
      errors.technologies = 'At least one technology/skill is required';
    }

    return errors;
  };

  return {
    validateProject,
    validateTestimonial,
    validateBlog,
    validateAbout,
    validateUser,
    validateHome,
    validateTimeline
  };
};
